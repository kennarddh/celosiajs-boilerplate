import { DependencyInjection, Injectable } from '@celosiajs/core'

import ConfigurationService from 'Services/ConfigurationService/ConfigurationService'

import TokenService from './TokenService'

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type RefreshTokenJWTPayload = {
	id: number
}

@Injectable()
class RefreshTokenService extends TokenService<RefreshTokenJWTPayload> {
	constructor(configurationService = DependencyInjection.get(ConfigurationService)) {
		super('RefreshTokenService', configurationService.configurations.tokens.refresh.secret, {
			expiresIn: configurationService.configurations.tokens.refresh.expire,
		})
	}
}

export default RefreshTokenService
