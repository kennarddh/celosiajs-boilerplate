import { ConvertExpressMiddleware } from '@celosiajs/core'

import cors from 'cors'

const whitelist = process.env.CORS_ORIGIN?.split(',') ?? []

const ExpressCors = cors({
	origin: (origin, callback) => {
		if (whitelist.includes(origin ?? '')) {
			callback(null, true)
			return
		}

		callback(null, false)
	},
})

const Cors = ConvertExpressMiddleware(ExpressCors)

export default Cors
