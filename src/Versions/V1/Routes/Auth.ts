import Router from 'Internals/Router'

import VerifyJWT from 'Middlewares/VerifyJWT'

import { GetUserData } from 'Versions/V1/Controllers/Auth/index'

const AuthRouter = new Router()

// Router.post('/register', RegisterValidation(), Register)
// Router.post('/login', LoginValidation(), Login)
AuthRouter.get('/user', [new VerifyJWT()], new GetUserData())
// Router.post('/refresh-token', RefreshToken)

export default Router
