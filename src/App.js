import express from 'express'

// Middleware
import cors from 'cors'
import compression from 'compression'
import helmet from 'helmet'
import cookieParser from 'cookie-parser'

import RateLimiter from './Middlewares/RateLimiter'
import MongoSanitize from './Middlewares/MongoSanitize'
import LogHttpRequest from './Middlewares/LogHttpRequest'

// Database
import './Database'

// Router
import AuthRouter from './Routes/Auth'
import DocsRouter from './Routes/Docs'
import NoMatchRouter from './Routes/NoMatch'

const app = express()

// Middleware
app.use(compression())
app.use(helmet())

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use(cookieParser())

app.use(cors())

app.use(RateLimiter)

app.use(MongoSanitize)

app.use(LogHttpRequest)

// Router
app.use('/api/auth', AuthRouter)

app.use('/api/docs', DocsRouter)

app.use('*', NoMatchRouter)

export default app
