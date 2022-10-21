import express from 'express'

import AuthRouter from './Auth'

const Router = express.Router()

Router.use('/auth', AuthRouter)

export default Router
