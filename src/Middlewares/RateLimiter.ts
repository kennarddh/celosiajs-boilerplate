import {
	CelosiaRequest,
	CelosiaResponse,
	DependencyInjection,
	EmptyObject,
	Middleware,
	NextFunction,
} from '@celosiajs/core'

import ConfigurationService from 'Services/ConfigurationService/ConfigurationService'
import { RateLimiterAbstract, RateLimiterMemory, RateLimiterRes } from 'rate-limiter-flexible'

import { JWTVerifiedData } from './VerifyJWT'

class RateLimiter extends Middleware {
	static ipRateLimiter: RateLimiterMemory
	static userRateLimiter: RateLimiterMemory

	constructor(
		private pointsToConsume = 1,
		private useUserRateLimiterIfPossible = true,
		configurationService = DependencyInjection.get(ConfigurationService),
	) {
		super('RateLimiter')

		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		if (!RateLimiter.ipRateLimiter) {
			RateLimiter.ipRateLimiter = new RateLimiterMemory({
				keyPrefix: 'ip',
				points: configurationService.configurations.rateLimiter.max,
				duration: configurationService.configurations.rateLimiter.window, // In seconds
			})
		}

		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		if (!RateLimiter.userRateLimiter) {
			RateLimiter.userRateLimiter = new RateLimiterMemory({
				keyPrefix: 'user',
				points: configurationService.configurations.rateLimiter.max,
				duration: configurationService.configurations.rateLimiter.window, // In seconds
			})
		}
	}

	public override async index(
		data: EmptyObject | JWTVerifiedData,
		request: CelosiaRequest,
		response: CelosiaResponse,
		next: NextFunction,
	) {
		if ('user' in data && this.useUserRateLimiterIfPossible) {
			try {
				const rateLimiterRes = await RateLimiter.userRateLimiter.consume(
					data.user.id,
					this.pointsToConsume,
				)

				this.handleRateLimiterRes(response, RateLimiter.userRateLimiter, rateLimiterRes)

				return next()
			} catch (error: unknown) {
				if (error instanceof RateLimiterRes) {
					const rateLimiterRes = error

					this.handleRateLimiterRes(response, RateLimiter.userRateLimiter, rateLimiterRes)

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
			const rateLimiterRes = await RateLimiter.ipRateLimiter.consume(
				request.ip,
				this.pointsToConsume,
			)

			this.handleRateLimiterRes(response, RateLimiter.ipRateLimiter, rateLimiterRes)

			return next()
		} catch (error: unknown) {
			if (error instanceof RateLimiterRes) {
				this.handleRateLimiterRes(response, RateLimiter.ipRateLimiter, error)

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
