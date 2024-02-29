import { Port, ServerApp } from 'index.js'

import Logger from 'Utils/Logger/Logger.js'

import prisma from 'Database/index.js'

const OnShutdown =
	(signal: string, exitCode: number = 0) =>
	async () => {
		let port = -1
		let serverApp = null

		try {
			port = Port
		} catch (error) {
			// Ignore cannot access 'Port' before initialization error
		}

		try {
			serverApp = ServerApp
		} catch (error) {
			// Ignore cannot access 'ServerApp' before initialization error
		}

		Logger.info(`${signal} signal received: Stopping server`, {
			port,
			pid: process.pid,
			env: process.env.NODE_ENV,
		})

		if (serverApp && serverApp.listening)
			await new Promise(resolve => ServerApp.close(resolve))

		Logger.info('Server closed', {
			port,
			pid: process.pid,
			env: process.env.NODE_ENV,
		})

		try {
			await prisma.$disconnect()

			Logger.info('Database connection closed')
		} catch (error) {
			Logger.error('Failed to close database connection', { error })
		}

		Logger.info('Exiting')

		process.exit(exitCode)
	}

export default OnShutdown
