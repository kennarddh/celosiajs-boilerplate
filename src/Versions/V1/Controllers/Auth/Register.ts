import { z } from 'zod'

import {
	CelosiaResponse,
	Controller,
	ControllerRequest,
	DependencyInjection,
	EmptyObject,
} from '@celosiajs/core'

import AuthService from 'Services/AuthService/AuthService'
import UserExistsError from 'Services/AuthService/Errors/UserExistsError'

class Register extends Controller {
	constructor(private authService = DependencyInjection.get(AuthService)) {
		super('AuthRegister')
	}

	public async index(
		_: EmptyObject,
		request: ControllerRequest<Register>,
		response: CelosiaResponse,
	) {
		const { username, name, password } = request.body

		try {
			const user = await this.authService.register(username, name, password)

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
