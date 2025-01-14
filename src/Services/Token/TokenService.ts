import jwt from 'jsonwebtoken'

import { JSONObject, Service } from '@celosiajs/core'

import TokenExpiredError from './Errors/TokenExpiredError'
import TokenSignError from './Errors/TokenSignError'
import TokenVerifyError from './Errors/TokenVerifyError'

abstract class TokenService<T extends JSONObject> extends Service {
	constructor(
		loggingSource: string,
		private secret: jwt.Secret,
		private option: jwt.SignOptions,
	) {
		super(loggingSource)
	}

	sign(payload: T): Promise<string> {
		return new Promise<string>((resolve, reject) => {
			jwt.sign(
				payload,
				this.secret,
				this.option,
				(error: Error | null, token: string | undefined) => {
					if (error) {
						this.logger.error('Sign.', error)

						return reject(new TokenSignError())
					}

					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					resolve(token!)
				},
			)
		})
	}

	verify(token: string): Promise<T> {
		return new Promise<T>((resolve, reject) => {
			jwt.verify(token, this.secret, (error, decoded) => {
				if (error) {
					if (error instanceof jwt.TokenExpiredError) {
						return reject(new TokenExpiredError(error.expiredAt))
					} else {
						return reject(new TokenVerifyError())
					}
				}

				resolve(decoded as T)
			})
		})
	}
}

export default TokenService
