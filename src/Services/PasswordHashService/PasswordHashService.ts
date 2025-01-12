import argon2 from 'argon2'

import { BaseService, Injectable, ServiceError } from '@celosiajs/core'

@Injectable()
class PasswordHashService extends BaseService {
	constructor() {
		super('PasswordHashService')
	}

	async hash(password: string): Promise<string> {
		try {
			return await argon2.hash(password, {
				hashLength: 64,
				secret: Buffer.from(process.env.PASSWORD_HASH_SECRET),
			})
		} catch (error) {
			this.logger.error('hash', error)

			throw new ServiceError()
		}
	}

	async verify(digest: string, password: string): Promise<boolean> {
		try {
			return await argon2.verify(digest, password, {
				secret: Buffer.from(process.env.PASSWORD_HASH_SECRET),
			})
		} catch (error) {
			if (error instanceof TypeError) {
				throw new TypeError('Invalid digest')
			}

			this.logger.error('Verify.', error)

			throw new ServiceError()
		}
	}
}

export default PasswordHashService
