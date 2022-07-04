import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

// Models
import User from '../Models/User'

import Logger from '../Utils/Logger/Logger'

export const Register = async (req, res) => {
	const { username, name, email, password } = req.body

	const user = new User({
		username: username.toLowerCase(),
		name,
		email: email.toLowerCase(),
		password: await bcrypt.hash(password, 10),
	})

	user.save()
		.then(() => {
			Logger.info('New user successfully created', {
				id: user._id,
			})

			return res.status(201).json({
				success: true,
				data: {
					id: user._id,
				},
			})
		})
		.catch(error => {
			Logger.error('New user failed to create', {
				id: user._id,
				error,
			})

			return res.status(500).json({
				success: false,
				error: 'Internal server error',
			})
		})
}

export const Login = (req, res) => {
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

export const GetUserData = (req, res) => {
	User.findById(req.user.id)
		.exec()
		.then(user => {
			Logger.error('Get user data success', {
				id: user.id,
			})

			return res.status(200).json({
				success: true,
				data: {
					id: user.id,
					username: user.username,
					name: user.name,
					email: user.email,
				},
			})
		})
		.catch(error => {
			Logger.error('Get user data find user failed', {
				error,
			})

			return res.status(500).json({
				success: false,
				error: 'Internal server error',
			})
		})
}
