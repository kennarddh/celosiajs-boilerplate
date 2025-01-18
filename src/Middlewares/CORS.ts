import { DependencyInjection, ExpressMiddlewareCompat, NoInputMiddleware } from '@celosiajs/core'

import cors from 'cors'

import ConfigurationService from 'Services/ConfigurationService/ConfigurationService'

const configurationService = DependencyInjection.get(ConfigurationService)

const ExpressCORS = cors({
	origin: (origin, callback) => {
		if (configurationService.configurations.corsOrigin.includes(origin ?? ''))
			return callback(null, true)

		callback(null, false)
	},
})

const CORS = ExpressMiddlewareCompat<NoInputMiddleware>('CORS', ExpressCORS)

export default CORS
