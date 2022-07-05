import bcrypt from 'bcrypt'

// Models
import User from '../../Models/User'

import Logger from '../../Utils/Logger/Logger'

const Register = async (req, res) => {
	const { username, name, email, password } = req.body

	const user = new User({
		username: username.toLowerCase(),
		name,
		email: email.toLowerCase(),
		password: await bcrypt.hash(password, 10),
	})

	user.save()
		.then(newUser => {
			Logger.info('New user successfully created', {
				id: newUser._id,
			})

			return res.status(201).json({
				success: true,
				data: {
					id: newUser._id,
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

export default Register
