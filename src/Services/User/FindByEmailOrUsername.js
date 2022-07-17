// Models
import User from '../../Models/User'

import Logger from '../../Utils/Logger/Logger'

const FindByEmailOrUsername = ({ email, username }) =>
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
