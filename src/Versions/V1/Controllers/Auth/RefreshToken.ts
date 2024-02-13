import { Request, Response } from 'express'

import { IUserJWTPayload } from 'Types/Http.js'
import jwt from 'jsonwebtoken'

import Logger from 'Utils/Logger/Logger.js'
import JWTSign from 'Utils/Promises/JWTSign.js'
import JWTVerify from 'Utils/Promises/JWTVerify.js'

interface ICookies {
	refreshToken: string
}

const RefreshToken = async (req: Request, res: Response) => {
	const { refreshToken }: ICookies = req.cookies

	if (!refreshToken)
		return res.status(400).json({
			errors: ['No refresh token provided'],
			data: {},
		})

	try {
		const user = await JWTVerify<IUserJWTPayload>(
			refreshToken,
			process.env.REFRESH_JWT_SECRET,
		)

		const payload = user

		try {
			const token = await JWTSign(payload, process.env.JWT_SECRET, {
				expiresIn: parseInt(process.env.JWT_EXPIRE, 10) 
			})

			try {
				const refreshToken = await JWTSign(
					payload,
					process.env.REFRESH_JWT_SECRET,
					{
						expiresIn: parseInt(process.env.REFRESH_JWT_EXPIRE, 10),
					},
				)

				res.cookie('refreshToken', refreshToken, {
					secure: process.env.NODE_ENV === 'production',
					httpOnly: true,
					sameSite: 'lax',
				})

				return res.status(200).json({
					errors: [],
					data: {
						token: `Bearer ${token}`,
					},
				})
			} catch (error) {
				Logger.error(
					'RefreshToken controller failed to sign refresh token JWT',
					{
						userID: user.id,
						error,
					},
				)

				return res.status(500).json({
					errors: ['Internal server error'],
					data: {},
				})
			}
		} catch (error) {
			Logger.error('RefreshToken controller failed to sign token JWT', {
				userID: user.id,
				error,
			})

			return res.status(500).json({
				errors: ['Internal server error'],
				data: {},
			})
		}
	} catch (error) {
		if (error instanceof jwt.TokenExpiredError)
			return res.status(401).json({
				errors: ['Expired refresh token'],
				data: {},
			})

		if (
			error instanceof jwt.JsonWebTokenError &&
			error.message === 'invalid signature'
		)
			return res.status(401).json({
				errors: ['Invalid refresh token'],
				data: {},
			})

		Logger.error('Unknown error while verifying refresh token', { error })

		return res.status(500).json({
			errors: ['Internal server error'],
			data: {},
		})
	}
}

export default RefreshToken
