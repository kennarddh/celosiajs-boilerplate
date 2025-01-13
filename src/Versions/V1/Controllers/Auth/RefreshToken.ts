import { z } from 'zod'

import {
	BaseController,
	CelosiaResponse,
	ControllerRequest,
	DependencyInjection,
	EmptyObject,
} from '@celosiajs/core'

import AuthService from 'Services/AuthService/AuthService'
import ConfigurationService from 'Services/ConfigurationService/ConfigurationService'
import TokenExpiredError from 'Services/Token/Errors/TokenExpiredError'
import TokenVerifyError from 'Services/Token/Errors/TokenVerifyError'

class RefreshToken extends BaseController {
	constructor(
		private authService = DependencyInjection.get(AuthService),
		private configurationService = DependencyInjection.get(ConfigurationService),
	) {
		super('AuthRefreshToken')
	}

	public async index(
		_: EmptyObject,
		request: ControllerRequest<RefreshToken>,
		response: CelosiaResponse,
	) {
		const { refreshToken: currentRefreshToken } = request.cookies

		try {
			const { accessToken, refreshToken } =
				await this.authService.refreshToken(currentRefreshToken)

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
			if (error instanceof TokenExpiredError) {
				return response.status(401).json({
					errors: { others: ['Refresh token expired'] },
					data: {},
				})
			} else if (error instanceof TokenVerifyError) {
				return response.status(401).json({
					errors: { others: ['Invalid refresh token'] },
					data: {},
				})
			}

			return response.sendInternalServerError()
		}
	}

	public override get cookies() {
		return z.object({
			refreshToken: z.string(),
		})
	}
}

export default RefreshToken
