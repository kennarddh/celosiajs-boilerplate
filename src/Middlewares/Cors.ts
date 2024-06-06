import cors from 'cors'

const whitelist = process.env.CORS_ORIGIN?.split(',') ?? []

const Cors = cors({
	origin: (origin, callback) => {
		if (whitelist.includes(origin ?? '')) {
			callback(null, true)
			return
		}

		callback(null, false)
	},
})

export default Cors
