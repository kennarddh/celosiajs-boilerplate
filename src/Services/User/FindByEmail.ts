import Logger from 'Utils/Logger/Logger'

import User, { IUser } from 'Models/User'

interface IFindByEmailParameters {
	email: string
}

interface IResolve {
	user: IUser
}

type IFindByEmail = (options: IFindByEmailParameters) => Promise<IResolve>

const FindByEmail: IFindByEmail = ({ email }) =>
	new Promise((resolve, reject) => {
		User.findOne({ email: email.toLowerCase() })
			.exec()
			.then(user => {
				if (!user) return reject({ code: 404 })

				resolve({ user })
			})
			.catch(error => {
				Logger.error('Find by email failed user service', {
					error,
				})

				reject({ code: 500 })
			})
	})

export default FindByEmail
