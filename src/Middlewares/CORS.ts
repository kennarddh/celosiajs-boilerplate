import { DependencyInjection, ExpressMiddlewareCompat, NoInputMiddleware } from '@celosiajs/core'

import ConfigurationService from 'Services/ConfigurationService/ConfigurationService'
import cors from 'cors'

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
