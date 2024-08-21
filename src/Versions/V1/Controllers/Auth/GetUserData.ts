import { BaseController, CelosiaResponse, IControllerRequest } from '@celosiajs/core'

import Logger from 'Utils/Logger/Logger'

import { JWTVerifiedData } from 'Middlewares/VerifyJWT'

import prisma from 'Database/index'

class GetUserData extends BaseController {
	public async index(
		data: JWTVerifiedData,
		_: IControllerRequest<GetUserData>,
		response: CelosiaResponse,
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
				Logger.error("Can't find user in GetUserData controller", { id })

				return response.extensions.sendInternalServerError()
			}

			return response.status(200).json({
				errors: {},
				data: {
					id: user.id,
					username: user.username,
					name: user.name,
				},
			})
		} catch (error) {
			Logger.error('GetUserData controller failed to get user', error, { id })

			return response.extensions.sendInternalServerError()
		}
	}
}

export default GetUserData
