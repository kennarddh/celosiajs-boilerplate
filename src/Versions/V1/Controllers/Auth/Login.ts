import argon2 from 'argon2'
import { z } from 'zod'

import { BaseController, EmptyObject, ExpressResponse, IControllerRequest } from 'Internals'

import { ITokenJWTPayload } from 'Types/Types'

import Logger from 'Utils/Logger/Logger'
import JWTSign from 'Utils/Promises/JWTSign'

import prisma from 'Database/index'

class Login extends BaseController {
	public async index(
		_: EmptyObject,
		request: IControllerRequest<Login>,
		response: ExpressResponse,
	) {
		const { username, password } = request.body

		try {
			const user = await prisma.user.findFirst({
				where: { username },
				select: { id: true, password: true },
			})

			if (!user)
				return response.status(403).json({
					errors: ['Cannot find user with the username'],
					data: {},
				})

			try {
				const isValidHash = await argon2.verify(user.password, password)

				if (!isValidHash)
					return response.status(403).json({
						errors: ['Wrong password'],
						data: {},
					})

				const payload: ITokenJWTPayload = { id: user.id }

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
							errors: [],
							data: {
								token: `Bearer ${token}`,
							},
						})
					} catch (error) {
						Logger.error('Login controller failed to sign refresh token JWT', {
							username,
							error,
						})

						return response.status(500).json({
							errors: ['Internal server error'],
							data: {},
						})
					}
				} catch (error) {
					Logger.error('Login controller failed to sign token JWT', {
						username,
						error,
					})

					return response.status(500).json({
						errors: ['Internal server error'],
						data: {},
					})
				}
			} catch (error) {
				Logger.error('Login controller failed verify hash', {
					username,
					error,
				})

				return response.status(500).json({
					errors: ['Internal server error'],
					data: {},
				})
			}
		} catch (error) {
			Logger.error('Login controller failed to get user', {
				username,
				error,
			})

			return response.status(500).json({
				errors: ['Internal server error'],
				data: {},
			})
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
