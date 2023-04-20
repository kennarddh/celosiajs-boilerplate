import express from 'express'

// Middleware
import compression from 'compression'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'

import RateLimiter from './Middlewares/RateLimiter'
import MongoSanitize from './Middlewares/MongoSanitize'
import LogHttpRequest from './Middlewares/LogHttpRequest'
import ParseJson from './Middlewares/ParseJson'
import Cors from './Middlewares/Cors'

// Database
import './Database'

// Router
import IndexRouter from './Routes'

const app = express()

// Settings
app.disable('x-powered-by')

// Middleware
app.use(compression())
app.use(helmet())

app.use(express.urlencoded({ extended: false }))
app.use(ParseJson)

app.use(cookieParser())

app.use(Cors)

app.use(RateLimiter)

app.use(MongoSanitize)

app.use(LogHttpRequest)

// Router
app.use('/api/', IndexRouter)

export default app
