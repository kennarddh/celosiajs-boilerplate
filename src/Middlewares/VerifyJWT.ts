import {
	BaseMiddleware,
	CelosiaRequest,
	CelosiaResponse,
	EmptyObject,
	StopHere,
} from '@celosiajs/core'

import jwt from 'jsonwebtoken'

import { ITokenJWTPayload } from 'Types/Types'

import Logger from 'Utils/Logger/Logger'
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
	public override async index(
		_: EmptyObject,
		request: CelosiaRequest,
		response: CelosiaResponse,
	) {
		const tokenHeader = request.header('Access-Token')

		if (!tokenHeader) {
			response.status(401).json({
				errors: {
					others: ['No token provided'],
				},
				data: {},
			})

			return StopHere
		}

		if (Array.isArray(tokenHeader)) {
			response.status(401).json({
				errors: {
					others: ['Token must not be an arrray'],
				},
				data: {},
			})

			return StopHere
		}

		const token = tokenHeader.split(' ')[1]

		if (!token) {
			response.status(401).json({
				errors: {
					others: ['Invalid token'],
				},
				data: {},
			})

			return StopHere
		}

		try {
			const user = await JWTVerify<ITokenJWTPayload>(token, process.env.JWT_SECRET)

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

				return StopHere
			}

			if (error instanceof jwt.JsonWebTokenError && error.message === 'invalid signature') {
				response.status(401).json({
					errors: { others: ['Invalid token'] },
					data: {},
				})

				return StopHere
			}

			Logger.error('Unknown error while verifying JWT', {
				error,
				token,
			})

			response.extensions.sendInternalServerError()

			return StopHere
		}
	}
}

export default VerifyJWT
