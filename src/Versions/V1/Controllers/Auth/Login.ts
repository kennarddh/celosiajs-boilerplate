import { Request, Response, response } from 'express'

import { IUserJWTPayload } from 'Types/Http.js'
import argon2 from 'argon2'

import Logger from 'Utils/Logger/Logger.js'
import JWTSign from 'Utils/Promises/JWTSign.js'

import prisma from 'Database/index.js'

interface IBody {
	username: string
	password: string
}

const Login = async (req: Request, res: Response) => {
	const { username, password }: IBody = req.body

	try {
		const user = await prisma.user.findFirst({
			where: { username },
			select: { id: true, password: true },
		})

		if (!user) {
			return res.status(403).json({
				errors: ['Cannot find user with the same username'],
				data: {},
			})
		}

		try {
			const isValidHash = await argon2.verify(user.password, password, {
				hashLength: 64,
			})

			if (!isValidHash)
				return res.status(403).json({
					errors: ['Wrong password'],
					data: {},
				})

			const payload: IUserJWTPayload = { id: user.id }

			try {
				const token = await JWTSign(payload, process.env.JWT_SECRET, {
					expiresIn: parseInt(process.env.JWT_EXPIRE, 10),
				})

				try {
					const refreshToken = await JWTSign(
						payload,
						process.env.REFRESH_JWT_SECRET,
						{
							expiresIn: parseInt(
								process.env.REFRESH_JWT_EXPIRE,
								10,
							),
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
						'Login controller failed to sign refresh token JWT',
						{
							username,
							error,
						},
					)

					return res.status(500).json({
						errors: ['Internal server error'],
						data: {},
					})
				}
			} catch (error) {
				Logger.error('Login controller failed to sign token JWT', {
					username,
					error,
				})

				return res.status(500).json({
					errors: ['Internal server error'],
					data: {},
				})
			}
		} catch (error) {
			Logger.error('Login controller failed verify hash', {
				username,
				error,
			})

			return res.status(500).json({
				errors: ['Internal server error'],
				data: {},
			})
		}
	} catch (error) {
		Logger.error('Login controller failed to get user', {
			username,
			error,
		})

		return res.status(500).json({
			errors: ['Internal server error'],
			data: {},
		})
	}
}

export default Login
