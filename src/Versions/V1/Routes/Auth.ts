import express from 'express'

// Controllers
import { Register, Login, GetUserData, Token } from '../Controllers/Auth'

// Middleware
import VerifyJWT from '../../../Middlewares/VerifyJWT'

// Validation
import RegisterValidation from '../Validation/Auth/Register'
import LoginValidation from '../Validation/Auth/Login'

const Router = express.Router()

Router.post('/register', RegisterValidation(), Register)
Router.post('/login', LoginValidation(), Login)
Router.get('/user', VerifyJWT, GetUserData)
Router.post('/token', Token)

export default Router
