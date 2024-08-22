import jwt from 'jsonwebtoken'

import {
	BaseMiddleware,
	CelosiaRequest,
	CelosiaResponse,
	EmptyObject,
	INextFunction,
} from '@celosiajs/core'

import { ITokenJWTPayload } from 'Types/Types'

import Logger from 'Utils/Logger/Logger'
import JWTVerify from 'Utils/Promises/JWTVerify'

export interface JWTVerifiedData {
	user: {
		id: number
	}
}

class VerifyJWT extends BaseMiddleware<
	CelosiaRequest,
	CelosiaResponse,
	EmptyObject,
	JWTVerifiedData
> {
	public override async index(
		_: EmptyObject,
		request: CelosiaRequest,
		response: CelosiaResponse,
		next: INextFunction<JWTVerifiedData>,
	) {
		const tokenHeader = request.header('Access-Token')

		if (!tokenHeader)
			return response.status(401).json({
				errors: {
					others: ['No token provided'],
				},
				data: {},
			})

		if (Array.isArray(tokenHeader))
			return response.status(401).json({
				errors: {
					others: ['Token must not be an arrray'],
				},
				data: {},
			})

		const token = tokenHeader.split(' ')[1]

		if (!token)
			return response.status(401).json({
				errors: {
					others: ['Invalid token'],
				},
				data: {},
			})

		try {
			const user = await JWTVerify<ITokenJWTPayload>(token, process.env.JWT_SECRET)

			next({
				user: {
					id: user.id,
				},
			})
		} catch (error) {
			if (error instanceof jwt.TokenExpiredError)
				return response.status(401).json({
					errors: {
						others: ['Expired token'],
					},
					data: {},
				})

			if (error instanceof jwt.JsonWebTokenError && error.message === 'invalid signature')
				return response.status(401).json({
					errors: { others: ['Invalid token'] },
					data: {},
				})

			Logger.error('Unknown error while verifying JWT', error, { token })

			return response.extensions.sendInternalServerError()
		}
	}
}

export default VerifyJWT
