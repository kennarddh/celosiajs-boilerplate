import { DependencyInjection, Injectable } from '@celosiajs/core'

import ConfigurationService from 'Services/ConfigurationService/ConfigurationService'

import TokenService from './TokenService'

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type IRefreshTokenJWTPayload = {
	id: number
}

@Injectable()
class RefreshTokenService extends TokenService<IRefreshTokenJWTPayload> {
	constructor(configurationService = DependencyInjection.get(ConfigurationService)) {
		super('RefreshTokenService', configurationService.configurations.tokens.refresh.secret, {
			expiresIn: configurationService.configurations.tokens.refresh.expire,
		})
	}
}

export default RefreshTokenService
