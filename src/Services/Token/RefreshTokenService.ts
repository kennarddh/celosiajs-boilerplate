import { Injectable } from '@celosiajs/core'

import TokenService from './TokenService'

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type IRefreshTokenJWTPayload = {
	id: number
}

@Injectable()
class RefreshTokenService extends TokenService<IRefreshTokenJWTPayload> {
	constructor() {
		super('RefreshTokenService', process.env.REFRESH_JWT_SECRET, {
			expiresIn: parseInt(process.env.REFRESH_JWT_EXPIRE, 10),
		})
	}
}

export default RefreshTokenService
