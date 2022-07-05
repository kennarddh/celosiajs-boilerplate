// Models
import User from '../../Models/User'

import Logger from '../../Utils/Logger/Logger'

const FindByEmail = ({ email }) =>
	new Promise((resolve, reject) => {
		User.findOne({ email: email.toLowerCase() })
			.exec()
			.then(user => {
				resolve({ user })
			})
			.catch(error => {
				Logger.error('Find by email failed', {
					error,
				})

				reject({ code: 500 })
			})
	})

export default FindByEmail
