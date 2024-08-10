import { CelosiaRouter } from '@celosiajs/core'

import AuthRouter from 'Versions/V1/Routes/Auth'

const V1Router = new CelosiaRouter({ strict: true })

V1Router.useRouters('/auth', AuthRouter)

export default V1Router
