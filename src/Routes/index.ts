import express from 'express'

import NoMatchRouter from './NoMatch'
import DocsRouter from './Docs'

import V1Router from '../Versions/V1/Routes/index'

const Router = express.Router()

Router.use('/v1', V1Router)

Router.use('/docs', DocsRouter)

Router.use('*', NoMatchRouter)

export default Router
