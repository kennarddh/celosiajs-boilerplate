import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

// Models
import User from '../../Models/User'

import Logger from '../../Utils/Logger/Logger'

const Login = (req, res) => {
	const { email, password } = req.body

	User.findOne({ email: email.toLowerCase() })
		.exec()
		.then(user => {
			if (!user) {
				return res.status(403).json({
					success: false,
					error: 'Invalid email or password',
				})
			}

			bcrypt
				.compare(password, user.password)
				.then(isPasswordCorrect => {
					if (!isPasswordCorrect) {
						return res.status(403).json({
							success: false,
							error: 'Invalid email or password',
						})
					}

					const payload = {
						id: user._id,
						username: user.username.toLowerCase(),
					}

					jwt.sign(
						payload,
						process.env.JWT_SECRET,
						{ expiresIn: 86400 },
						(error, token) => {
							if (error) {
								Logger.error('Login jwt failed', {
									id: user._id,
									error,
								})

								return res.status(500).json({
									success: false,
									error: 'Internal server error',
								})
							}

							Logger.info('User logged in successfully', {
								id: user._id,
							})

							return res.status(200).json({
								success: true,
								data: {
									token: `Bearer ${token}`,
								},
							})
						}
					)
				})
				.catch(error => {
					Logger.error('Login bcrypt failed', {
						id: user._id,
						error,
					})

					return res.status(500).json({
						success: false,
						error: 'Internal server error',
					})
				})
		})
		.catch(error => {
			Logger.error('Login find user failed', {
				error,
			})

			return res.status(500).json({
				success: false,
				error: 'Internal server error',
			})
		})
}

export default Login
