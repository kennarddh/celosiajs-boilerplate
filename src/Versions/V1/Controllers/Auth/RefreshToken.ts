import jwt from 'jsonwebtoken'
import { z } from 'zod'

import { BaseController, EmptyObject, ExpressResponse, IControllerRequest } from 'Internals'

import { ITokenJWTPayload } from 'Types/Types'

import Logger from 'Utils/Logger/Logger'
import JWTSign from 'Utils/Promises/JWTSign'
import JWTVerify from 'Utils/Promises/JWTVerify'

class RefreshToken extends BaseController {
	public async index(
		_: EmptyObject,
		request: IControllerRequest<RefreshToken>,
		response: ExpressResponse,
	) {
		const { refreshToken } = request.cookies

		try {
			const user = await JWTVerify<ITokenJWTPayload>(
				refreshToken,
				process.env.REFRESH_JWT_SECRET,
			)

			const payload = { id: user.id } satisfies ITokenJWTPayload

			try {
				const token = await JWTSign(payload, process.env.JWT_SECRET, {
					expiresIn: parseInt(process.env.JWT_EXPIRE, 10),
				})

				try {
					const refreshToken = await JWTSign(payload, process.env.REFRESH_JWT_SECRET, {
						expiresIn: parseInt(process.env.REFRESH_JWT_EXPIRE, 10),
					})

					response.cookie('refreshToken', refreshToken, {
						secure: process.env.NODE_ENV === 'production',
						httpOnly: true,
						sameSite: 'lax',
					})

					return response.status(200).json({
						errors: {},
						data: {
							token: `Bearer ${token}`,
						},
					})
				} catch (error) {
					Logger.error('RefreshToken controller failed to sign refresh token JWT', {
						userID: user.id,
						error,
					})

					return response.status(500).json({
						errors: { others: ['Internal server error'] },
						data: {},
					})
				}
			} catch (error) {
				Logger.error('RefreshToken controller failed to sign token JWT', {
					userID: user.id,
					error,
				})

				return response.status(500).json({
					errors: { others: ['Internal server error'] },
					data: {},
				})
			}
		} catch (error) {
			if (error instanceof jwt.TokenExpiredError)
				return response.status(401).json({
					errors: { others: ['Expired refresh token'] },
					data: {},
				})

			if (error instanceof jwt.JsonWebTokenError && error.message === 'invalid signature')
				return response.status(401).json({
					errors: { others: ['Invalid refresh token'] },
					data: {},
				})

			Logger.error('Unknown error while verifying refresh token', { error })

			return response.status(500).json({
				errors: { others: ['Internal server error'] },
				data: {},
			})
		}
	}

	public override get cookies() {
		return z.object({
			refreshToken: z.string(),
		})
	}
}

export default RefreshToken
