import { ExpressRouter } from 'Internals'

import AuthRouter from 'Versions/V1/Routes/Auth'

const V1Router = new ExpressRouter({ strict: true })

V1Router.useRouters('/auth', AuthRouter)

export default V1Router
