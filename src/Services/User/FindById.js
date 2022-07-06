// Models
import User from '../../Models/User'

import Logger from '../../Utils/Logger/Logger'

const FindById = ({ id }) =>
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
