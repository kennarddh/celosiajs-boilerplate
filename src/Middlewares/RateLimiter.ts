import { NextFunction, Request, Response } from 'express'

import rateLimit from 'express-rate-limit'

const RateLimiter =
	process.env.NODE_ENV === 'production'
		? rateLimit({
				windowMs:
					parseInt(process.env.RATE_LIMITER_WINDOW_MS, 10) ||
					1 * 60 * 1000, // 1 minutes
				max: parseInt(process.env.RATE_LIMITER_MAX, 10) || 100, // Limit each IP to 100 requests per `window` (here, per 1 minutes)
				standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
				legacyHeaders: false, // Disable the `X-RateLimit-*` headers,
				message: {
					errors: ['Too many requests, please try again later.'],
					data: {},
				},
		  }) // eslint-disable-line no-mixed-spaces-and-tabs
		: (_: Request, __: Response, next: NextFunction) => next()

export default RateLimiter
