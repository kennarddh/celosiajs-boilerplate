import { Port } from 'index'

import Instance from 'App'

import Logger from 'Utils/Logger/Logger'

import prisma from 'Database/index'

const OnShutdown = async (signal: string, exitCode = 0) => {
	Logger.info(`${signal} signal received: Stopping server`, {
		port: Port,
		pid: process.pid,
		env: process.env.NODE_ENV,
	})

	if (Instance.isListening)
		await new Promise(resolve => {
			Instance.close()
				.then(resolve)
				.catch(() => {
					Logger.info('Failed to close Instance')
				})
		})

	Logger.info('Server closed', {
		port: Port,
		pid: process.pid,
		env: process.env.NODE_ENV,
	})

	try {
		await prisma.$disconnect()

		Logger.info('Database connection closed')
	} catch (error) {
		Logger.error('Failed to close database connection', error)
	}

	Logger.info('Exiting')

	process.exit(exitCode)
}

export default OnShutdown
