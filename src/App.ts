import compression from 'compression'

import helmet from 'helmet'

import { CelosiaInstance, ExpressMiddlewareCompat, NoInputMiddleware } from '@celosiajs/core'

import CORS from 'Middlewares/CORS'
import LogHTTPRequest from 'Middlewares/LogHTTPRequest'

import Router from 'Routes'

const Instance = new CelosiaInstance({ strict: true })

// Middleware
Instance.useMiddlewares(
	new (ExpressMiddlewareCompat<NoInputMiddleware>('Compression', compression()))(),
)
Instance.useMiddlewares(new (ExpressMiddlewareCompat<NoInputMiddleware>('Helmet', helmet()))())
Instance.useMiddlewares(new CORS())
Instance.useMiddlewares(new LogHTTPRequest())

Instance.useRouters(Router)

Instance.addErrorHandler()

export default Instance
