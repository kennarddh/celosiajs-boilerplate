// Models
import User from '../../Models/User'

import Logger from '../../Utils/Logger/Logger'

const FindByEmail = ({ email }) =>
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
