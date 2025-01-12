import { Injectable } from '@celosiajs/core'

import TokenService from './TokenService'

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type IAccessTokenJWTPayload = {
	id: number
}

@Injectable()
class AccessTokenService extends TokenService<IAccessTokenJWTPayload> {
	constructor() {
		super('AccessTokenService', process.env.JWT_SECRET, {
			expiresIn: parseInt(process.env.JWT_EXPIRE, 10),
		})
	}
}

export default AccessTokenService
