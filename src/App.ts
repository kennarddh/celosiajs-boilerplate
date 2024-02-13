import express from 'express'

import compression from 'compression'

import cookieParser from 'cookie-parser'

import helmet from 'helmet'

/* eslint-disable prettier/prettier */
import Cors from 'Middlewares/Cors.js'
import LogHttpRequest from 'Middlewares/LogHttpRequest.js'
import ParseJson from 'Middlewares/ParseJson.js'
import RateLimiter from 'Middlewares/RateLimiter.js'

import Routes from 'Routes/index.js'

import 'Database/index.js'

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

app.use(LogHttpRequest)

// Router
app.use('/api/', Routes)

export default app
