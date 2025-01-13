import { ExpressMiddlewareCompat, NoInputMiddleware } from '@celosiajs/core'

import cors from 'cors'

const whitelist = process.env.CORS_ORIGIN?.split(',') ?? []

const ExpressCORS = cors({
	origin: (origin, callback) => {
		if (whitelist.includes(origin ?? '')) return callback(null, true)

		callback(null, false)
	},
})

const CORS = ExpressMiddlewareCompat<NoInputMiddleware>('CORS', ExpressCORS)

export default CORS
