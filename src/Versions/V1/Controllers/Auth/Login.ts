import { Request, Response } from 'express'

import bcrypt from 'bcrypt'

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
			select: { password: true },
		})

		if (!user) {
			return res.status(403).json({
				errors: ['Cannot find user with the same username'],
				data: {},
			})
		}
	} catch (error) {
		Logger.info('Login controller failed to get user', {
			username,
			error,
		})

		return res.status(500).json({
			errors: ['Internal server error'],
			data: {},
		})
	}

	FindUserByEmail({ email })
		.then(({ user }) => {
			bcrypt
				.compare(password, user.password)
				.then(isPasswordCorrect => {
					if (!isPasswordCorrect) {
						return res.status(403).json({
							errors: ['Invalid email or password'],
							data: {},
						})
					}

					const payload = {
						id: user._id,
					}

					JWTSign(payload, process.env.JWT_SECRET, {
						expiresIn: parseInt(process.env.JWT_EXPIRE, 10) || 60, // Expires in 1 minute
					})
						.then(token => {
							JWTSign(payload, process.env.REFRESH_JWT_SECRET, {
								expiresIn:
									parseInt(
										process.env.REFRESH_JWT_EXPIRE,
										10,
									) || 60 * 60 * 24 * 30, // Expires in 30 days
							})
								.then(refreshToken => {
									Logger.info('User logged in successfully', {
										id: user._id,
									})

									res.cookie('refreshToken', refreshToken, {
										secure:
											process.env.NODE_ENV ===
											'production',
										httpOnly: true,
										sameSite: 'lax',
									})

									return res.status(200).json({
										errors: [],
										data: {
											token: `Bearer ${token}`,
										},
									})
								})
								.catch(error => {
									Logger.error(
										'Login refresh token jwt failed',
										{
											id: user._id,
											error,
										},
									)

									return res.status(500).json({
										errors: ['Internal server error'],
										data: {},
									})
								})
						})
						.catch(error => {
							Logger.error('Login jwt failed', {
								id: user._id,
								error,
							})

							return res.status(500).json({
								errors: ['Internal server error'],
								data: {},
							})
						})
				})
				.catch(error => {
					Logger.error('Login bcrypt failed', {
						id: user._id,
						error,
					})

					return res.status(500).json({
						errors: ['Internal server error'],
						data: {},
					})
				})
		})
		.catch(({ code }) => {
			if (code === 404) {
				return res.status(403).json({
					errors: ['Invalid email or password'],
					data: {},
				})
			}

			return res.status(500).json({
				errors: ['Internal server error'],
				data: {},
			})
		})
}

export default Login
