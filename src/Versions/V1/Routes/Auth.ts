import { ExpressRouter } from 'Internals/ExpressProvider'

import VerifyJWT from 'Middlewares/VerifyJWT'

import { GetUserData } from 'Versions/V1/Controllers/Auth/index'

const AuthRouter = new ExpressRouter({ strict: true })

// Router.post('/register', RegisterValidation(), Register)
// Router.post('/login', LoginValidation(), Login)
AuthRouter.get('/user', [new VerifyJWT()], new GetUserData())
// Router.post('/refresh-token', RefreshToken)

export default AuthRouter
