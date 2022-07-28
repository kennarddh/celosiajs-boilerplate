import Logger from '../../Utils/Logger/Logger'

import JWTSign from '../../Utils/Promises/JWTSign'
import JWTVerify from '../../Utils/Promises/JWTVerify'

const Token = (req, res) => {
	const { refreshToken } = req.cookies

	if (!refreshToken)
		return res
			.status(400)
			.json({ success: false, error: 'Refresh token is required' })

	JWTVerify(refreshToken, process.env.REFRESH_JWT_SECRET)
		.then(decoded => {
			const payload = {
				id: decoded.id,
				username: decoded.username,
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
								success: true,
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
								success: false,
								error: 'Internal server error',
							})
						})
				})
				.catch(error => {
					Logger.error('Create new token jwt failed', {
						id: decoded.id,
						error,
					})

					return res.status(500).json({
						success: false,
						error: 'Internal server error',
					})
				})
		})
		.catch(() => {
			return res.status(401).json({
				success: false,
				error: 'Failed to authenticate',
			})
		})
}

export default Token
