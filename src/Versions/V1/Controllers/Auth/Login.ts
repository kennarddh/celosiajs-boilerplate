import { z } from 'zod'

import {
	BaseController,
	CelosiaResponse,
	ControllerRequest,
	DependencyInjection,
	EmptyObject,
} from '@celosiajs/core'

import UnauthorizedError from 'Services/UserService/Errors/UnauthorizedError'
import UserService from 'Services/UserService/UserService'

class Login extends BaseController {
	constructor(private userService = DependencyInjection.get(UserService)) {
		super('AuthLogin')
	}

	public async index(
		_: EmptyObject,
		request: ControllerRequest<Login>,
		response: CelosiaResponse,
	) {
		const { username, password } = request.body

		try {
			const { accessToken, refreshToken } = await this.userService.login(username, password)

			response.cookie('refreshToken', refreshToken, {
				secure: process.env.NODE_ENV === 'production',
				httpOnly: true,
				sameSite: 'lax',
			})

			return response.status(200).json({
				errors: {},
				data: {
					token: `Bearer ${accessToken}`,
				},
			})
		} catch (error) {
			if (error instanceof UnauthorizedError) {
				return response.status(401).json({
					errors: { others: ['Unauthorized'] },
					data: {},
				})
			}

			return response.sendInternalServerError()
		}
	}

	public override get body() {
		return z.object({
			username: z.string().trim().min(1).max(50),
			password: z
				.string()
				.min(8)
				.max(100)
				.regex(/^(?!.*\s)/g, 'Must not contains white space.'),
		})
	}
}

export default Login
