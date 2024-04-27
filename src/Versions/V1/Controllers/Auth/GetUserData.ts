import BaseController from 'Internals/BaseController'
import Logger from 'Utils/Logger/Logger'

import { JWTVerified } from 'Middlewares/VerifyJWT'

import prisma from 'Database/index'
import BaseResponse from 'Internals/Providers/Base/BaseResponse'
import { IControllerRequest } from 'Internals/Types'

class GetUserData extends BaseController {
	public async index(
		data: JWTVerified,
		request: IControllerRequest<typeof this>,
		response: BaseResponse,
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
