import jwt from 'jsonwebtoken'

import {
	BaseMiddleware,
	CelosiaRequest,
	CelosiaResponse,
	DependencyInjection,
	EmptyObject,
	NextFunction,
} from '@celosiajs/core'

import ConfigurationService from 'Services/ConfigurationService/ConfigurationService'

import { ITokenJWTPayload } from 'Types/Types'

import JWTVerify from 'Utils/Promises/JWTVerify'

export interface JWTVerifiedData {
	user: {
		id: number
	}
}

class VerifyJWT extends BaseMiddleware<
	CelosiaRequest,
	CelosiaResponse,
	EmptyObject,
	JWTVerifiedData
> {
	constructor(private configurationService = DependencyInjection.get(ConfigurationService)) {
		super('VerifyJWT')
	}

	public override async index(
		_: EmptyObject,
		request: CelosiaRequest,
		response: CelosiaResponse,
		next: NextFunction<JWTVerifiedData>,
	) {
		const tokenHeader = request.header('Access-Token')

		if (!tokenHeader)
			return response.status(401).json({
				errors: {
					others: ['No token provided'],
				},
				data: {},
			})

		if (Array.isArray(tokenHeader))
			return response.status(401).json({
				errors: {
					others: ['Token must not be an arrray'],
				},
				data: {},
			})

		const token = tokenHeader.split(' ')[1]

		if (!token)
			return response.status(401).json({
				errors: {
					others: ['Invalid token'],
				},
				data: {},
			})

		try {
			const user = await JWTVerify<ITokenJWTPayload>(
				token,
				this.configurationService.configurations.tokens.access.secret,
			)

			next({
				user: {
					id: user.id,
				},
			})
		} catch (error) {
			if (error instanceof jwt.TokenExpiredError)
				return response.status(401).json({
					errors: {
						others: ['Expired token'],
					},
					data: {},
				})

			if (error instanceof jwt.JsonWebTokenError && error.message === 'invalid signature')
				return response.status(401).json({
					errors: { others: ['Invalid token'] },
					data: {},
				})

			this.logger.error('Error.', error, { token, requestId: request.id })

			return response.sendInternalServerError()
		}
	}
}

export default VerifyJWT
