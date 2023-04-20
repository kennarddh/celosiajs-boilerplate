import cors from 'cors'

const whitelist = process.env.CORS_ORIGIN?.split(',') || []

const Cors = cors({
	origin: (origin, callback) => {
		if (whitelist.includes(origin ?? '')) return callback(null, true)

		callback(null, false)
	},
})

export default Cors
