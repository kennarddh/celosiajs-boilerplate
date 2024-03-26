import express from 'express'

import { IControllerRequest } from 'Internals/BaseController'
import Router from 'Internals/Router'

import VerifyJWT from 'Middlewares/VerifyJWT'

import { GetUserData, Login, RefreshToken, Register } from 'Versions/V1/Controllers/Auth/index'

import LoginValidation from 'Versions/V1/Validation/Auth/Login'
import RegisterValidation from 'Versions/V1/Validation/Auth/Register'

// const Router = express.Router()

const AuthRouter = new Router()

// Router.post('/register', RegisterValidation(), Register)
// Router.post('/login', LoginValidation(), Login)
AuthRouter.get('/user', [new VerifyJWT()], new GetUserData())
// Router.post('/refresh-token', RefreshToken)

type x = IControllerRequest<GetUserData>

export default Router
