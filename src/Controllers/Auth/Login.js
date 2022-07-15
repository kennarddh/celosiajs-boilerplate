import bcrypt from 'bcrypt'

import Logger from '../../Utils/Logger/Logger'

import FindUserByEmail from '../../Services/User/FindByEmail'

import JWTSign from '../../Utils/Promises/JWTSign'

const Login = (req, res) => {
	const { email, password } = req.body

	FindUserByEmail({ email })
		.then(({ user }) => {
			bcrypt
				.compare(password, user.password)
				.then(isPasswordCorrect => {
					if (!isPasswordCorrect) {
						console.log({
							isPasswordCorrect,
							password,
							'user.password': user.password,
						})
						return res.status(403).json({
							success: false,
							error: 'Invalid email or password',
						})
					}

					const payload = {
						id: user._id,
						username: user.username.toLowerCase(),
					}

					JWTSign(payload, process.env.JWT_SECRET, {
						expiresIn: 86400,
					})
						.then(token => {
							Logger.info('User logged in successfully', {
								id: user._id,
							})

							return res.status(200).json({
								success: true,
								data: {
									token: `Bearer ${token}`,
								},
							})
						})
						.catch(error => {
							Logger.error('Login jwt failed', {
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
		.catch(({ code }) => {
			if (code === 500) {
				return res.status(500).json({
					success: false,
					error: 'Internal server error',
				})
			}

			if (code === 404) {
				return res.status(403).json({
					success: false,
					error: 'Invalid email or password',
				})
			}
		})
}

export default Login
