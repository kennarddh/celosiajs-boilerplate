import { z } from 'zod'

import {
	BaseController,
	CelosiaResponse,
	ControllerRequest,
	DependencyInjection,
	EmptyObject,
} from '@celosiajs/core'

import AuthService from 'Services/AuthService/AuthService'
import UnauthorizedError from 'Services/AuthService/Errors/UnauthorizedError'
import ConfigurationService from 'Services/ConfigurationService/ConfigurationService'

class Login extends BaseController {
	constructor(
		private authService = DependencyInjection.get(AuthService),
		private configurationService = DependencyInjection.get(ConfigurationService),
	) {
		super('AuthLogin')
	}

	public async index(
		_: EmptyObject,
		request: ControllerRequest<Login>,
		response: CelosiaResponse,
	) {
		const { username, password } = request.body

		try {
			const { accessToken, refreshToken } = await this.authService.login(username, password)

			response.cookie('refreshToken', refreshToken, {
				secure: this.configurationService.configurations.nodeEnv === 'production',
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
