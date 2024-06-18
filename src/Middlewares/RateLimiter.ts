import { RateLimiterAbstract, RateLimiterMemory, RateLimiterRes } from 'rate-limiter-flexible'

import { BaseMiddleware, EmptyObject, ExpressRequest, ExpressResponse, StopHere } from 'Internals'

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
		request: ExpressRequest,
		response: ExpressResponse,
	) {
		if ('user' in data && this.useUserRateLimiterIfPossible) {
			try {
				const rateLimiterRes = await userRateLimiter.consume(
					data.user.id,
					this.pointsToConsume,
				)

				this.handleRateLimiterRes(response, userRateLimiter, rateLimiterRes)

				return
			} catch (error: unknown) {
				if (error instanceof RateLimiterRes) {
					const rateLimiterRes = error

					this.handleRateLimiterRes(response, userRateLimiter, rateLimiterRes)

					response
						.status(429)
						.json({ errors: { others: ['Rate limit exceeded'] }, data: {} })

					return StopHere
				}

				Logger.error('User rate limiter error', error)

				response.status(500).json({
					errors: { others: ['Internal server error'] },
					data: {},
				})

				return StopHere
			}
		}

		if (request.ip === undefined) {
			Logger.warn('Rate limiter undefined ip')

			response.status(500).json({
				errors: { others: ['Internal server error'] },
				data: {},
			})

			return StopHere
		}

		try {
			const rateLimiterRes = await ipRateLimiter.consume(request.ip, this.pointsToConsume)

			this.handleRateLimiterRes(response, ipRateLimiter, rateLimiterRes)
		} catch (error: unknown) {
			if (error instanceof RateLimiterRes) {
				const rateLimiterRes = error

				this.handleRateLimiterRes(response, ipRateLimiter, rateLimiterRes)

				response.status(429).json({ errors: { others: ['Rate limit exceeded'] }, data: {} })

				return StopHere
			}

			Logger.error('Rate limiter error', error)

			response.status(500).json({
				errors: { others: ['Internal server error'] },
				data: {},
			})

			return StopHere
		}

		return
	}

	private handleRateLimiterRes(
		response: ExpressResponse,
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
