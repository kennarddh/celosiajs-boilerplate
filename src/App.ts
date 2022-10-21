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
import IndexRouter from './Routes'

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
app.use('/api/', IndexRouter)

export default app
