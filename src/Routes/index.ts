import express from 'express'

import V1Router from 'Versions/V1/Routes/index'

import DocsRouter from './Docs'
import NoMatchRouter from './NoMatch'

const Router = express.Router()

Router.use('/v1', V1Router)

Router.use('/docs', DocsRouter)

Router.use('*', NoMatchRouter)

export default Router
