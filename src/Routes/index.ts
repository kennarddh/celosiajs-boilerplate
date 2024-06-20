import NoMatchController from 'Controllers/NoMatchController'

import { ExpressRouter } from 'Internals'

import V1Router from 'Versions/V1/Routes/index'

const Router = new ExpressRouter({ strict: true })

Router.useRouters('/v1', V1Router)

Router.all('*', [], new NoMatchController())

export default Router
