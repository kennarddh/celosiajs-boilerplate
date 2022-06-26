import 'dotenv/config'

import express from 'express'

// Middleware
import cors from 'cors'
import compression from 'compression'
import helmet from 'helmet'
import RateLimiter from './Middlewares/RateLimiter'

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

app.use(RateLimiter)

// Database
db.on('error', error => {
	console.log(`MongoDB connection error: ${error}`)
})

// Router
app.use('/api/auth', AuthRouter)

app.use('*', NoMatchRouter)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
