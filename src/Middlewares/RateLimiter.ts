import { RateLimiterMemory, RateLimiterRes } from 'rate-limiter-flexible'

import { BaseMiddleware, EmptyObject, ExpressRequest, ExpressResponse, StopHere } from 'Internals'

import Logger from 'Utils/Logger/Logger'

const rateLimiter = new RateLimiterMemory({
	points: 100,
	duration: 60, // In seconds
})

class RateLimiter extends BaseMiddleware {
	public override async index(
		_: EmptyObject,
		request: ExpressRequest,
		response: ExpressResponse,
	) {
		if (request.ip === undefined) {
			Logger.warn('Rate limiter undefined ip')

			return StopHere
		}

		try {
			const rateLimiterRes = await rateLimiter.consume(request.ip, 1)

			const headers = {
				'Retry-After': rateLimiterRes.msBeforeNext / 1000,
				'RateLimit-Limit': rateLimiter.points,
				'RateLimit-Remaining': rateLimiterRes.remainingPoints,
				'RateLimit-Reset': Date.now() + rateLimiterRes.msBeforeNext,
			}

			response.header(headers)
		} catch (error: unknown) {
			if (error instanceof RateLimiterRes) {
				const rateLimiterRes = error

				const headers = {
					'Retry-After': rateLimiterRes.msBeforeNext / 1000,
					'RateLimit-Limit': rateLimiter.points,
					'RateLimit-Remaining': rateLimiterRes.remainingPoints,
					'RateLimit-Reset': Date.now() + rateLimiterRes.msBeforeNext,
				}

				response.header(headers)

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

		return {}
	}
}

export default RateLimiter
