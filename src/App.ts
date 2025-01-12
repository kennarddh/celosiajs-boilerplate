import compression from 'compression'

import helmet from 'helmet'

import { CelosiaInstance, ExpressMiddlewareCompat, NoInputMiddleware } from '@celosiajs/core'

import CORS from 'Middlewares/CORS'
import LogHttpRequest from 'Middlewares/LogHttpRequest'

import Router from 'Routes'

const Instance = new CelosiaInstance({ strict: true })

// Middleware
Instance.useMiddlewares(
	new (ExpressMiddlewareCompat<NoInputMiddleware>('Compression', compression()))(),
)
Instance.useMiddlewares(new (ExpressMiddlewareCompat<NoInputMiddleware>('Helmet', helmet()))())
Instance.useMiddlewares(new CORS())
Instance.useMiddlewares(new LogHttpRequest())

Instance.useRouters(Router)

export default Instance
