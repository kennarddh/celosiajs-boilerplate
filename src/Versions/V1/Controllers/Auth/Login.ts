import argon2 from 'argon2'

import { z } from 'zod'

import { BaseController, CelosiaResponse, EmptyObject, IControllerRequest } from '@celosiajs/core'

import { ITokenJWTPayload } from 'Types/Types'

import Logger from 'Utils/Logger/Logger'
import JWTSign from 'Utils/Promises/JWTSign'

import prisma from 'Database/index'

class Login extends BaseController {
	public async index(
		_: EmptyObject,
		request: IControllerRequest<Login>,
		response: CelosiaResponse,
	) {
		const { username, password } = request.body

		try {
			const user = await prisma.user.findFirst({
				where: { username },
				select: { id: true, password: true },
			})

			if (!user)
				return response.status(403).json({
					errors: { others: ['Cannot find user with the username'] },
					data: {},
				})

			try {
				const isValidHash = await argon2.verify(user.password, password)

				if (!isValidHash)
					return response.status(403).json({
						errors: { others: ['Wrong password'] },
						data: {},
					})

				const payload = { id: user.id } satisfies ITokenJWTPayload

				try {
					const token = await JWTSign(payload, process.env.JWT_SECRET, {
						expiresIn: parseInt(process.env.JWT_EXPIRE, 10),
					})

					try {
						const refreshToken = await JWTSign(
							payload,
							process.env.REFRESH_JWT_SECRET,
							{
								expiresIn: parseInt(process.env.REFRESH_JWT_EXPIRE, 10),
							},
						)

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
						Logger.error('Login controller failed to sign refresh token JWT', error, {
							username,
						})

						return response.extensions.sendInternalServerError()
					}
				} catch (error) {
					Logger.error('Login controller failed to sign token JWT', error, {
						username,
					})

					return response.extensions.sendInternalServerError()
				}
			} catch (error) {
				Logger.error('Login controller failed verify hash', error, {
					username,
				})

				return response.extensions.sendInternalServerError()
			}
		} catch (error) {
			Logger.error('Login controller failed to get user', error, {
				username,
			})

			return response.extensions.sendInternalServerError()
		}
	}

	public override get body() {
		return z.object({
			username: z.string().trim().min(1).max(50),
			password: z
				.string()
				.min(8)
				.max(100)
				.regex(/^(?!.*\s)/g, 'Must not contains white space.'),
		})
	}
}

export default Login
