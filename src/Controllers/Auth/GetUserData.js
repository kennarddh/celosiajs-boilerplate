import Logger from '../../Utils/Logger/Logger'

import FindUserById from '../../Services/User/FindById'

const GetUserData = (req, res) => {
	const { id } = req.user

	FindUserById({ id })
		.then(({ user }) => {
			Logger.error('Get user data success', {
				id: user.id,
			})

			return res.status(200).json({
				success: true,
				data: {
					id: user._id,
					username: user.username,
					name: user.name,
					email: user.email,
				},
			})
		})
		.catch(({ code }) => {
			if (code === 500) {
				return res.status(500).json({
					success: false,
					error: 'Internal server error',
				})
			}

			if (code === 404) {
				return res.status(403).json({
					success: false,
					error: 'Invalid email or password',
				})
			}
		})
}

export default GetUserData
