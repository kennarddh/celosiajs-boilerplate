import { Server } from 'http'

import Logger from 'Utils/Logger/Logger'

import Database from 'Database/index'

const OnShutdown =
	(server: Server, port: number | string, signal: string) => async () => {
		const computedPort =
			typeof port === 'number' ? port : parseInt(port, 10)

		Logger.info(`${signal} signal received: Stopping server`, {
			port: computedPort,
			pid: process.pid,
			env: process.env.NODE_ENV,
		})

		await new Promise(resolve => {
			server.close(resolve)
		})

		Logger.info('Server Stopped', {
			port: computedPort,
			pid: process.pid,
			env: process.env.NODE_ENV,
		})

		await Database.close(false)

		Logger.info('Database connection closed')

		process.exit(0)
	}

export default OnShutdown
