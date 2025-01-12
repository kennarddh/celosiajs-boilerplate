import {
	BaseController,
	CelosiaResponse,
	ControllerRequest,
	DependencyInjection,
} from '@celosiajs/core'

import UserService from 'Services/UserService/UserService'

import { JWTVerifiedData } from 'Middlewares/VerifyJWT'

class GetUserData extends BaseController {
	constructor(private userService = DependencyInjection.get(UserService)) {
		super('AuthGetUserData')
	}

	public async index(
		data: JWTVerifiedData,
		request: ControllerRequest<GetUserData>,
		response: CelosiaResponse,
	) {
		const id = data.user.id

		try {
			const userData = await this.userService.getUserData(id)

			if (!userData) {
				this.logger.error("Can't find user.", { id, requestId: request.id })

				return response.sendInternalServerError()
			}

			return response.status(200).json({
				errors: {},
				data: {
					id: userData.id,
					username: userData.username,
					name: userData.name,
				},
			})
		} catch (error) {
			this.logger.error('Failed to get user', error, { id, requestId: request.id })

			return response.sendInternalServerError()
		}
	}
}

export default GetUserData
