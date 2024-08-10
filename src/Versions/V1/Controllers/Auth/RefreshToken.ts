import { BaseController, CelosiaResponse, EmptyObject, IControllerRequest } from '@celosiajs/core'

import jwt from 'jsonwebtoken'
import { z } from 'zod'

import { ITokenJWTPayload } from 'Types/Types'

import Logger from 'Utils/Logger/Logger'
import JWTSign from 'Utils/Promises/JWTSign'
import JWTVerify from 'Utils/Promises/JWTVerify'

class RefreshToken extends BaseController {
	public async index(
		_: EmptyObject,
		request: IControllerRequest<RefreshToken>,
		response: CelosiaResponse,
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
					Logger.error(
						'RefreshToken controller failed to sign refresh token JWT',
						error,
						{
							userID: user.id,
						},
					)

					response.extensions.sendInternalServerError()

					return
				}
			} catch (error) {
				Logger.error('RefreshToken controller failed to sign token JWT', error, {
					userID: user.id,
				})

				response.extensions.sendInternalServerError()

				return
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

			Logger.error('Unknown error while verifying refresh token', error)

			response.extensions.sendInternalServerError()

			return
		}
	}

	public override get cookies() {
		return z.object({
			refreshToken: z.string(),
		})
	}
}

export default RefreshToken
