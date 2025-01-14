import { CelosiaRouter } from '@celosiajs/core'

import HealthController from 'Controllers/HealthController'
import NoMatchController from 'Controllers/NoMatchController'

import V1Router from 'Versions/V1/Routes/index'

const Router = new CelosiaRouter({ strict: true })

Router.useRouters('/v1', V1Router)

Router.get('/health', [], new HealthController())
Router.all('/*splat', [], new NoMatchController())

export default Router
