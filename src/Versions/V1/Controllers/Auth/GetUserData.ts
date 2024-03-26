import BaseController, { IControllerRequest, IControllerResponse } from 'Internals/BaseController'
import { z } from 'zod'

import Logger from 'Utils/Logger/Logger'

import { JWTVerified } from 'Middlewares/VerifyJWT'

import prisma from 'Database/index'

class GetUserData extends BaseController {
	public override get body() {
		return z.object({ data: z.string() })
	}

	public async index(
		data: JWTVerified,
		request: IControllerRequest<typeof this>,
		response: IControllerResponse,
	) {
		const id = data.user.id

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

				return response.status(500).json({
					errors: ['Internal server error'],
					data: {},
				})
			}

			return response.status(200).json({
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

			return response.status(500).json({
				errors: ['Internal server error'],
				data: {},
			})
		}
	}
}

export default GetUserData
