import express from 'express'

import compression from 'compression'

import cookieParser from 'cookie-parser'

import helmet from 'helmet'

/* eslint-disable prettier/prettier */
import Cors from 'Middlewares/Cors'
import LogHttpRequest from 'Middlewares/LogHttpRequest'
import MongoSanitize from 'Middlewares/MongoSanitize'
import ParseJson from 'Middlewares/ParseJson'
import RateLimiter from 'Middlewares/RateLimiter'

import Routes from 'Routes/index'

import 'Database/index'

/* eslint-enable prettier/prettier */

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
app.use('/api/', Routes)

export default app
