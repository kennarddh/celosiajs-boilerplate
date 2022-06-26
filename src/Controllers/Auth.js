import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

// Models
import User from '../Models/User'

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
			return res.status(201).json({
				success: true,
				data: {
					id: user._id,
				},
			})
		})
		.catch(() => {
			return res.status(500).json({
				success: false,
				error: 'User not created',
			})
		})
}

export const Login = (req, res) => {
	const { email, password } = req.body

	User.findOne({ email })
		.exec()
		.then(user => {
			if (!user) {
				return res.status(403).json({
					success: false,
					error: 'Invalid email or password',
				})
			}

			bcrypt.compare(password, user.password).then(isPasswordCorrect => {
				if (!isPasswordCorrect) {
					return res.status(403).json({
						success: false,
						error: 'Invalid email or password',
					})
				}

				const payload = {
					id: user._id,
					username: user.username,
				}

				jwt.sign(
					payload,
					process.env.JWT_SECRET,
					{ expiresIn: 86400 },
					(error, token) => {
						if (error)
							return res.status(500).json({
								success: false,
								error: 'Login Failed',
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
		})
}
