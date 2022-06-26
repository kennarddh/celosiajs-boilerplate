import express from 'express'

// Controllers
import { Register, Login, GetUserData } from '../Controllers/Auth'

// Middleware
import VerifyJWT from '../Middlewares/VerifyJWT'

const Router = express.Router()

Router.post('/auth/register', Register)
Router.post('/auth/login', Login)
Router.get('/auth/user', VerifyJWT, GetUserData)

export default Router
