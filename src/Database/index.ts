import mongoose from 'mongoose'

import Logger from 'Utils/Logger/Logger'

mongoose.connect(process.env.DB_HOST).catch(error => {
	Logger.error('Mongo DB connect error', { error })
})

const db = mongoose.connection

db.on('error', error => {
	Logger.error('Mongo DB connection error', { error })
})

export default db
