import 'dotenv/config'

import App from './App'

import Logger from './Utils/Logger/Logger'

import Database from './Database'

const PORT = process.env.PORT || 8080

const server = App.listen(PORT, () =>
	Logger.info(`Server running`, {
		port: PORT,
		pid: process.pid,
		env: process.env.NODE_ENV,
	})
)

// Graceful Shutdown
const OnShutdown = (signal: string) => () => {
	Logger.info(`${signal} signal received: Stopping server`, {
		port: PORT,
		pid: process.pid,
		env: process.env.NODE_ENV,
	})

	server.close(() => {
		Logger.info('Server Stopped', {
			port: PORT,
			pid: process.pid,
			env: process.env.NODE_ENV,
		})

		Database.close(false).then(() => {
			Logger.info('Database connection closed')

			process.exit(0)
		})
	})
}

process.on('SIGTERM', OnShutdown('SIGTERM'))

process.on('SIGINT', OnShutdown('SIGINT'))
