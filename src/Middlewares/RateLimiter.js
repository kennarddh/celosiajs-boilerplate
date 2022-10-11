import rateLimit from 'express-rate-limit'

const RateLimiter = rateLimit({
	windowMs: process.env.RATE_LIMITER_WINDOW_MS || 1 * 60 * 1000, // 1 minutes
	max: process.env.RATE_LIMITER_MAX || 100, // Limit each IP to 100 requests per `window` (here, per 1 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers,
	message: {
		errors: ['Too many requests, please try again later.'],
		data: {},
	},
})

export default RateLimiter
