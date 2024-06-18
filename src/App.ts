import Cors from 'Middlewares/Cors'
import LogHttpRequest from 'Middlewares/LogHttpRequest'

import Router from 'Routes'

import 'Database/index'

import { ExpressInstance } from './Internals'

const Instance = new ExpressInstance({ strict: true })

// TODO: Group method for router
// TODO: Update readme

// Middleware
Instance.useMiddlewares(new Cors())
Instance.useMiddlewares(new LogHttpRequest())

Instance.useRouters('/api', Router)

export default Instance
