// Models
import User from '../../Models/User'

import Logger from '../../Utils/Logger/Logger'

const GetUserData = (req, res) => {
	User.findById(req.user.id)
		.exec()
		.then(user => {
			Logger.error('Get user data success', {
				id: user.id,
			})

			return res.status(200).json({
				success: true,
				data: {
					id: user.id,
					username: user.username,
					name: user.name,
					email: user.email,
				},
			})
		})
		.catch(error => {
			Logger.error('Get user data find user failed', {
				error,
			})

			return res.status(500).json({
				success: false,
				error: 'Internal server error',
			})
		})
}

export default GetUserData
