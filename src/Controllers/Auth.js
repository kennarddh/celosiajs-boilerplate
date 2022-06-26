import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

// Models
import User from '../Models/User'

export const Register = async (req, res) => {
	const { username, name, email, password } = req

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
