import { NextFunction, Request, Response } from 'express'

import { IUserJWTPayload } from 'Types/Http.js'
import jwt from 'jsonwebtoken'

import Logger from 'Utils/Logger/Logger.js'
import JWTVerify from 'Utils/Promises/JWTVerify.js'

const VerifyJWT = async (req: Request, res: Response, next: NextFunction) => {
	const tokenHeader = req.get('Access-Token')

	if (!tokenHeader) {
		return res.status(401).json({
			errors: ['No token provided'],
			data: {},
		})
	}

	const token = tokenHeader?.split(' ')[1]

	if (!token)
		return res.status(401).json({
			errors: ['Invalid token'],
			data: {},
		})

	try {
		const user = await JWTVerify<IUserJWTPayload>(
			token,
			process.env.JWT_SECRET,
		)

		req.user = { id: user.id }

		next()
	} catch (error) {
		if (error instanceof jwt.TokenExpiredError)
			return res.status(401).json({
				errors: ['Expired token'],
				data: {},
			})

		if (
			error instanceof jwt.JsonWebTokenError &&
			error.message === 'invalid signature'
		)
			return res.status(401).json({
				errors: ['Invalid token'],
				data: {},
			})

		Logger.error('Unknown error while verifying JWT', { error, token })

		return res.status(500).json({
			errors: ['Internal server error'],
			data: {},
		})
	}
}

export default VerifyJWT
