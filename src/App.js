import 'dotenv/config'

import express from 'express'

// Middleware
import cors from 'cors'
import compression from 'compression'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'

// Database
import db from './Database'

// Router
import AuthRouter from './Routes/Auth'
import NoMatchRouter from './Routes/NoMatch'

const app = express()
const PORT = process.env.PORT || 8080

// Middleware
app.use(compression())
app.use(helmet())

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use(cors())

const limiter = rateLimit({
	windowMs: 1 * 60 * 1000, // 1 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 1 minutes)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

app.use(limiter)

// Database
db.on('error', error => {
	console.log(`MongoDB connection error: ${error}`)
})

// Router
app.use('/api/auth', AuthRouter)

app.use('*', NoMatchRouter)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
