import express from 'express'

import AuthRouter from 'Versions/V1/Routes/Auth.js'

const Router = express.Router()

Router.use('/auth', AuthRouter)

export default Router
