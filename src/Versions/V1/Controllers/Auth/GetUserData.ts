import { Request, Response } from 'express'

import Logger from 'Utils/Logger/Logger.js'

import prisma from 'Database/index.js'

const GetUserData = async (req: Request, res: Response) => {
	const id = req.user?.id

	if (!id) {
		Logger.error('Undefined id in GetUserData controller', {
			id,
		})

		return res.status(500).json({
			errors: ['Internal server error'],
			data: {},
		})
	}

	try {
		const user = await prisma.user.findFirst({
			where: { id },
			select: {
				id: true,
				username: true,
				name: true,
			},
		})

		if (!user) {
			Logger.error("Can't find user in GetUserData controller", {
				id,
			})

			return res.status(500).json({
				errors: ['Internal server error'],
				data: {},
			})
		}

		return res.status(200).json({
			errors: [],
			data: {
				id: user.id,
				username: user.username,
				name: user.name,
			},
		})
	} catch (error) {
		Logger.error('GetUserData controller failed to get user', {
			id,
			error,
		})

		return res.status(500).json({
			errors: ['Internal server error'],
			data: {},
		})
	}
}

export default GetUserData
