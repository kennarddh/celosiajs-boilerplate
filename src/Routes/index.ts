import express from 'express'

import V1Router from 'Versions/V1/Routes/index'

import NoMatchRouter from './NoMatch'

const Router = express.Router()

Router.use('/v1', V1Router)

Router.use('*', NoMatchRouter)

export default Router
