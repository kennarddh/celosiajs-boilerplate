import { Request, Response } from 'express'

import { IUser } from 'Types/Http'

import Logger from 'Utils/Logger/Logger'
import JWTSign from 'Utils/Promises/JWTSign'
import JWTVerify from 'Utils/Promises/JWTVerify'

interface ICookies {
	refreshToken: string
}

const Token = (req: Request, res: Response) => {
	const { refreshToken }: ICookies = req.cookies

	if (!refreshToken)
		return res
			.status(400)
			.json({ errors: ['Refresh token is required'], data: {} })

	JWTVerify<IUser>(refreshToken, process.env.REFRESH_JWT_SECRET)
		.then(decoded => {
			const payload = {
				id: decoded.id,
			}

			JWTSign(payload, process.env.JWT_SECRET, {
				expiresIn: parseInt(process.env.JWT_EXPIRE, 10) || 60, // Expires in 1 minute
			})
				.then(token => {
					JWTSign(payload, process.env.REFRESH_JWT_SECRET, {
						expiresIn:
							parseInt(process.env.REFRESH_JWT_EXPIRE, 10) ||
							60 * 60 * 24 * 30, // Expires in 30 days
					})
						.then(newRefreshToken => {
							Logger.info('User refresh token successfully', {
								id: decoded.id,
							})

							res.cookie('refreshToken', newRefreshToken, {
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
						})
						.catch(error => {
							Logger.error('Refresh token jwt failed', {
								id: decoded.id,
								error,
							})

							return res.status(500).json({
								errors: ['Internal server error'],
								data: {},
							})
						})
				})
				.catch(error => {
					Logger.error('Create new token jwt failed', {
						id: decoded.id,
						error,
					})

					return res.status(500).json({
						errors: ['Internal server error'],
						data: {},
					})
				})
		})
		.catch(() => {
			return res.status(401).json({
				errors: ['Failed to authenticate'],
				data: {},
			})
		})
}

export default Token
