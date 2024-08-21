import { ConvertExpressMiddleware } from '@celosiajs/core'

import cors from 'cors'

const whitelist = process.env.CORS_ORIGIN?.split(',') ?? []

const ExpressCors = cors({
	origin: (origin, callback) => {
		if (whitelist.includes(origin ?? '')) return callback(null, true)

		callback(null, false)
	},
})

const Cors = ConvertExpressMiddleware(ExpressCors)

export default Cors
