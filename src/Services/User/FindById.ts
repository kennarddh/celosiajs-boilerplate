import { Types } from 'mongoose'

import Logger from 'Utils/Logger/Logger'

import User, { IUser } from 'Models/User'

interface IFindByIdParameters {
	id: string | Types.ObjectId
}

interface IResolve {
	user: IUser
}

type IFindById = (options: IFindByIdParameters) => Promise<IResolve>

const FindById: IFindById = ({ id }) =>
	new Promise((resolve, reject) => {
		User.findById(id)
			.exec()
			.then(user => {
				if (!user) return reject({ code: 404 })

				resolve({ user })
			})
			.catch(error => {
				Logger.error('Find by id failed user service', {
					error,
				})

				reject({ code: 500 })
			})
	})

export default FindById
