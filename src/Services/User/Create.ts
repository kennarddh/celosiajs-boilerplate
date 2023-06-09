import bcrypt from 'bcrypt'

import Logger from 'Utils/Logger/Logger'

import User, { IUser } from 'Models/User'

interface ICreateParameters {
	username: string
	name: string
	email: string
	password: string
}

interface IResolve {
	user: IUser
}

type ICreate = (options: ICreateParameters) => Promise<IResolve>

const Create: ICreate = ({ username, name, email, password }) =>
	new Promise<IResolve>((resolve, reject) => {
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

						const userResolve: IUser = {
							_id: user._id,
							username: user.username,
							name: user.name,
							email: user.email,
							password: user.password,
						}

						resolve({ user: userResolve })
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
