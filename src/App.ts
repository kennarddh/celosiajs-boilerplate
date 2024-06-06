import Cors from 'Middlewares/Cors'
import LogHttpRequest from 'Middlewares/LogHttpRequest'

import 'Database/index'

import { ConvertExpressMiddleware, ExpressInstance } from './Internals'

const Instance = new ExpressInstance({ strict: true })

// Middleware
Instance.useMiddlewares(new (ConvertExpressMiddleware(Cors))())
Instance.useMiddlewares(new LogHttpRequest())

export default Instance
