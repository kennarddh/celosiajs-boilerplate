import Cors from 'Middlewares/Cors'
import LogHttpRequest from 'Middlewares/LogHttpRequest'

import 'Database/index'

import { ExpressInstance } from './Internals'

const Instance = new ExpressInstance({ strict: true })

// Middleware
Instance.useMiddlewares(new Cors())
Instance.useMiddlewares(new LogHttpRequest())

export default Instance
