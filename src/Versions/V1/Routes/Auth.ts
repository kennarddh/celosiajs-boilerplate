import { CelosiaRouter } from '@celosiajs/core'

import RateLimiter from 'Middlewares/RateLimiter'
import VerifyJWT from 'Middlewares/VerifyJWT'

import { GetUserData, Login, RefreshToken, Register } from 'Versions/V1/Controllers/Auth/index'

const AuthRouter = new CelosiaRouter({ strict: true })

AuthRouter.useMiddlewares(new RateLimiter())

AuthRouter.post('/register', [], new Register())
AuthRouter.post('/login', [], new Login())
AuthRouter.get('/user', [new VerifyJWT()], new GetUserData())
AuthRouter.post('/refresh-token', [], new RefreshToken())

export default AuthRouter
