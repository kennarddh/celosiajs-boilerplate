import express from 'express'

import AuthRouter from 'Versions/V1/Routes/Auth'

const Router = express.Router()

Router.use('/auth', AuthRouter)

export default Router
