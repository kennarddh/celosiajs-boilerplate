import express from 'express'

import VerifyJWT from 'Middlewares/VerifyJWT.js'

import {
	GetUserData,
	Login,
	Register,
	Token,
} from 'Versions/V1/Controllers/Auth/index.js'

import LoginValidation from 'Versions/V1/Validation/Auth/Login.js'
import RegisterValidation from 'Versions/V1/Validation/Auth/Register.js'

const Router = express.Router()

Router.post('/register', RegisterValidation(), Register)
Router.post('/login', LoginValidation(), Login)
Router.get('/user', VerifyJWT, GetUserData)
Router.post('/token', Token)

export default Router
