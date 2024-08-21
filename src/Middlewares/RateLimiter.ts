import {
	BaseMiddleware,
	CelosiaRequest,
	CelosiaResponse,
	EmptyObject,
	INextFunction,
} from '@celosiajs/core'
import '@celosiajs/extensions'

import { RateLimiterAbstract, RateLimiterMemory, RateLimiterRes } from 'rate-limiter-flexible'

import Logger from 'Utils/Logger/Logger'

import { JWTVerifiedData } from './VerifyJWT'

const ipRateLimiter = new RateLimiterMemory({
	keyPrefix: 'ip',
	points: 100,
	duration: 60, // In seconds
})

const userRateLimiter = new RateLimiterMemory({
	keyPrefix: 'user',
	points: 100,
	duration: 60, // In seconds
})

class RateLimiter extends BaseMiddleware {
	constructor(
		private pointsToConsume = 1,
		private useUserRateLimiterIfPossible = true,
	) {
		super()
	}

	public override async index(
		data: EmptyObject | JWTVerifiedData,
		request: CelosiaRequest,
		response: CelosiaResponse,
		next: INextFunction,
	) {
		if ('user' in data && this.useUserRateLimiterIfPossible) {
			try {
				const rateLimiterRes = await userRateLimiter.consume(
					data.user.id,
					this.pointsToConsume,
				)

				this.handleRateLimiterRes(response, userRateLimiter, rateLimiterRes)

				return next()
			} catch (error: unknown) {
				if (error instanceof RateLimiterRes) {
					const rateLimiterRes = error

					this.handleRateLimiterRes(response, userRateLimiter, rateLimiterRes)

					return response
						.status(429)
						.json({ errors: { others: ['Rate limit exceeded'] }, data: {} })
				}

				Logger.error('User rate limiter error', error)

				return response.extensions.sendInternalServerError()
			}
		}

		if (request.ip === undefined) {
			Logger.warn('Rate limiter undefined ip')

			return response.extensions.sendInternalServerError()
		}

		try {
			const rateLimiterRes = await ipRateLimiter.consume(request.ip, this.pointsToConsume)

			this.handleRateLimiterRes(response, ipRateLimiter, rateLimiterRes)
		} catch (error: unknown) {
			if (error instanceof RateLimiterRes) {
				this.handleRateLimiterRes(response, ipRateLimiter, error)

				return response
					.status(429)
					.json({ errors: { others: ['Rate limit exceeded'] }, data: {} })
			}

			Logger.error('Rate limiter error', error)

			return response.extensions.sendInternalServerError()
		}

		next()
	}

	private handleRateLimiterRes(
		response: CelosiaResponse,
		rateLimiter: RateLimiterAbstract,
		rateLimiterRes: RateLimiterRes,
	) {
		const headers = {
			'Retry-After': Math.ceil(rateLimiterRes.msBeforeNext / 1000),
			'RateLimit-Limit': rateLimiter.points,
			'RateLimit-Remaining': rateLimiterRes.remainingPoints,
			'RateLimit-Used': this.pointsToConsume,
			'RateLimit-Reset': Math.ceil((Date.now() + rateLimiterRes.msBeforeNext) / 1000),
		}

		response.header(headers)
	}
}

export default RateLimiter
