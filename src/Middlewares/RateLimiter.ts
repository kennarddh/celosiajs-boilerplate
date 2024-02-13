import { NextFunction, Request, Response } from 'express'

import rateLimit from 'express-rate-limit'

const RateLimiter =
	process.env.NODE_ENV === 'production'
		? rateLimit({
				windowMs: parseInt(process.env.RATE_LIMITER_WINDOW_MS, 10),
				max: parseInt(process.env.RATE_LIMITER_MAX, 10),
				standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
				legacyHeaders: false, // Disable the `X-RateLimit-*` headers,
				message: {
					errors: ['Too many requests, please try again later.'],
					data: {},
				},
			}) // eslint-disable-line no-mixed-spaces-and-tabs
		: (_: Request, __: Response, next: NextFunction) => next()

export default RateLimiter
