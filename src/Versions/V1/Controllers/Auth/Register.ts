import { z } from 'zod'

import {
	BaseController,
	CelosiaResponse,
	ControllerRequest,
	DependencyInjection,
	EmptyObject,
} from '@celosiajs/core'

import UserExistsError from 'Services/UserService/Errors/UserExistsError'
import UserService from 'Services/UserService/UserService'

class Register extends BaseController {
	constructor(private userService = DependencyInjection.get(UserService)) {
		super('AuthRegister')
	}

	public async index(
		_: EmptyObject,
		request: ControllerRequest<Register>,
		response: CelosiaResponse,
	) {
		const { username, name, password } = request.body

		try {
			const user = await this.userService.register(username, name, password)

			return response.status(201).json({
				errors: {},
				data: {
					id: user.id,
				},
			})
		} catch (error) {
			if (error instanceof UserExistsError) {
				return response.status(422).json({
					errors: { others: ['Username is already taken'] },
					data: {},
				})
			}

			return response.sendInternalServerError()
		}
	}

	public override get body() {
		return z.object({
			name: z.string().trim().min(1).max(100),
			username: z.string().trim().min(1).max(50),
			password: z
				.string()
				.min(8)
				.max(100)
				.regex(/^(?!.*\s)/g, 'Must not contains white space.'),
		})
	}
}

export default Register
