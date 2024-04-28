import Router from 'Internals/Providers/Base/BaseRouter'
import ExpressRouter from 'Internals/Providers/Express/ExpressRouter'

import VerifyJWT from 'Middlewares/VerifyJWT'

import { GetUserData } from 'Versions/V1/Controllers/Auth/index'

const AuthRouter = new ExpressRouter()

// Router.post('/register', RegisterValidation(), Register)
// Router.post('/login', LoginValidation(), Login)
AuthRouter.get('/user', [new VerifyJWT()], new GetUserData())
// Router.post('/refresh-token', RefreshToken)

export default Router
