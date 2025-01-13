import { DependencyInjection, Injectable } from '@celosiajs/core'

import ConfigurationService from 'Services/ConfigurationService/ConfigurationService'

import TokenService from './TokenService'

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type IAccessTokenJWTPayload = {
	id: number
}

@Injectable()
class AccessTokenService extends TokenService<IAccessTokenJWTPayload> {
	constructor(configurationService = DependencyInjection.get(ConfigurationService)) {
		super('AccessTokenService', configurationService.configurations.tokens.access.secret, {
			expiresIn: configurationService.configurations.tokens.access.expire,
		})
	}
}

export default AccessTokenService
