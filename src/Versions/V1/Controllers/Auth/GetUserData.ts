import { Request, Response } from 'express'

import Logger from 'Utils/Logger/Logger'

import FindUserById from 'Services/User/FindById'

const GetUserData = (req: Request, res: Response) => {
	const id = req.user?.id

	if (!id) {
		Logger.error('Undefined id GetUserData controller', {
			id,
		})

		return res.status(500).json({
			errors: ['Internal server error'],
			data: {},
		})
	}

	FindUserById({ id })
		.then(({ user }) => {
			Logger.info('Get user data success', {
				id: user._id,
			})

			return res.status(200).json({
				errors: [],
				data: {
					id: user._id,
					username: user.username,
					name: user.name,
					email: user.email,
				},
			})
		})
		.catch(({ code }) => {
			if (code === 404) {
				Logger.info('Get user data not found user', {
					id,
				})
			}

			return res.status(500).json({
				errors: ['Internal server error'],
				data: {},
			})
		})
}

export default GetUserData
