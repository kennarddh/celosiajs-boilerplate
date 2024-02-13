import { Server } from 'http'

import Logger from 'Utils/Logger/Logger.js'

import prisma from 'Database/index.js'

const OnShutdown =
	(server: Server, port: number, signal: string) => async () => {
		Logger.info(`${signal} signal received: Stopping server`, {
			port,
			pid: process.pid,
			env: process.env.NODE_ENV,
		})

		await new Promise(resolve => server.close(resolve))

		Logger.info('Server Stopped', {
			port,
			pid: process.pid,
			env: process.env.NODE_ENV,
		})

		await prisma.$disconnect()

		Logger.info('Database connection closed')

		process.exit(0)
	}

export default OnShutdown
