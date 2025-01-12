import {
	BaseMiddleware,
	CelosiaRequest,
	CelosiaResponse,
	EmptyObject,
	NextFunction,
} from '@celosiajs/core'

import { RateLimiterAbstract, RateLimiterMemory, RateLimiterRes } from 'rate-limiter-flexible'

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
		super('RateLimiter')
	}

	public override async index(
		data: EmptyObject | JWTVerifiedData,
		request: CelosiaRequest,
		response: CelosiaResponse,
		next: NextFunction,
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

				this.logger.error('User rate limiter error.', { requestId: request.id }, error)

				return response.sendInternalServerError()
			}
		}

		if (request.ip === undefined) {
			this.logger.warn('Undefined ip.', { requestId: request.id })

			return response.sendInternalServerError()
		}

		try {
			const rateLimiterRes = await ipRateLimiter.consume(request.ip, this.pointsToConsume)

			this.handleRateLimiterRes(response, ipRateLimiter, rateLimiterRes)

			return next()
		} catch (error: unknown) {
			if (error instanceof RateLimiterRes) {
				this.handleRateLimiterRes(response, ipRateLimiter, error)

				return response
					.status(429)
					.json({ errors: { others: ['Rate limit exceeded'] }, data: {} })
			}

			this.logger.error('IP rate limiter error.', { requestId: request.id }, error)

			return response.sendInternalServerError()
		}
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
