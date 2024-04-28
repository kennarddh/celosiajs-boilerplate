import jwt from 'jsonwebtoken'

import BaseMiddleware from 'Internals/BaseMiddleware'
import BaseRequest from 'Internals/Providers/Base/BaseRequest'
import BaseResponse from 'Internals/Providers/Base/BaseResponse'
import { EmptyObject } from 'Internals/Types'

import { IUserJWTPayload } from 'Types/Http'

import Logger from 'Utils/Logger/Logger'
import JWTVerify from 'Utils/Promises/JWTVerify'

export interface JWTVerified {
	user: {
		id: number
	}
}

class VerifyJWT extends BaseMiddleware {
	public override async index(
		_: EmptyObject,
		request: BaseRequest,
		response: BaseResponse,
	): Promise<JWTVerified> {
		const tokenHeader = request.header('Access-Token')

		if (!tokenHeader) {
			response.status(401).json({
				errors: {
					others: ['No token provided'],
				},
				data: {},
			})

			throw new Error()
		}

		if (Array.isArray(tokenHeader)) {
			response.status(401).json({
				errors: {
					others: ['Token must not be an arrray'],
				},
				data: {},
			})

			throw new Error()
		}

		const token = tokenHeader?.split(' ')[1]

		if (!token) {
			response.status(401).json({
				errors: {
					others: ['Invalid token'],
				},
				data: {},
			})

			throw new Error()
		}

		try {
			const user = await JWTVerify<IUserJWTPayload>(token, process.env.JWT_SECRET)

			return {
				user: {
					id: user.id,
				},
			}
		} catch (error) {
			if (error instanceof jwt.TokenExpiredError) {
				response.status(401).json({
					errors: {
						others: ['Expired token'],
					},
					data: {},
				})

				throw new Error()
			}

			if (error instanceof jwt.JsonWebTokenError && error.message === 'invalid signature') {
				response.status(401).json({
					errors: ['Invalid token'],
					data: {},
				})

				throw new Error()
			}

			Logger.error('Unknown error while verifying JWT', {
				error,
				token,
			})

			response.status(500).json({
				errors: {
					others: ['Internal server error'],
				},
				data: {},
			})

			throw new Error()
		}
	}
}

export default VerifyJWT
