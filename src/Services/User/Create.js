import bcrypt from 'bcrypt'

// Models
import User from '../../Models/User'

import Logger from '../../Utils/Logger/Logger'

const Create = ({ username, name, email, password }) =>
	new Promise((resolve, reject) => {
		bcrypt
			.hash(password, 10)
			.then(passwordHash => {
				const user = new User({
					username: username.toLowerCase(),
					name,
					email: email.toLowerCase(),
					password: passwordHash,
				})

				user.save()
					.then(() => {
						Logger.info('Create user success', {
							id: user._id,
						})

						resolve({ id: user._id })
					})
					.catch(error => {
						Logger.error('Create user to database failed', {
							id: user._id,
							error,
						})

						reject({ code: 500 })
					})
			})
			.catch(error => {
				Logger.error(
					'Create user service generate password hash failed',
					{ error }
				)

				reject({ code: 500 })
			})
	})

export default Create
