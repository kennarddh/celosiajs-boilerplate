import mongoose from 'mongoose'

import Logger from '../Utils/Logger/Logger'

mongoose
	.connect(process.env.DB_HOST, { useNewUrlParser: true })
	.catch(error => {
		Logger.error('Mongo DB connection error', { error })
	})

const db = mongoose.connection

export default db
