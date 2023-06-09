import Logger from 'Utils/Logger/Logger'

import User, { IUser } from 'Models/User'

interface IFindByEmailOrUsernameParameters {
	email: string
	username: string
}

interface IResolve {
	user: IUser
}

type IFindByEmailOrUsername = (
	options: IFindByEmailOrUsernameParameters
) => Promise<IResolve>

const FindByEmailOrUsername: IFindByEmailOrUsername = ({ email, username }) =>
	new Promise((resolve, reject) => {
		User.findOne({
			$or: [
				{ email: email.toLowerCase() },
				{ username: username.toLowerCase() },
			],
		})
			.exec()
			.then(user => {
				if (!user) return reject({ code: 404 })

				resolve({ user })
			})
			.catch(error => {
				Logger.error('Find by email or username failed user service', {
					error,
				})

				reject({ code: 500 })
			})
	})

export default FindByEmailOrUsername
