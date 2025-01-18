import { DependencyInjection } from '@celosiajs/core'

import Instance from 'App'

import Logger from 'Utils/Logger/Logger'

import DatabaseRepository from 'Repositories/DatabaseRepository'

import ConfigurationService from 'Services/ConfigurationService/ConfigurationService'

const OnShutdown = async (signal: string | undefined, exitCode = 0) => {
	const configurationService = DependencyInjection.get(ConfigurationService)

	Logger.info(signal ? `${signal} signal received: Stopping server.` : 'Stopping server.', {
		port: configurationService.configurations.port,
		pid: process.pid,
		env: configurationService.configurations.nodeEnv,
	})

	if (Instance.isListening) {
		await new Promise(resolve => {
			Instance.close()
				.then(resolve)
				.catch(() => {
					Logger.info('Failed to close Instance.')
				})
		})
	}

	Logger.info('Server closed.', {
		port: configurationService.configurations.port,
		pid: process.pid,
		env: configurationService.configurations.nodeEnv,
	})

	try {
		await DependencyInjection.get(DatabaseRepository).disconnect()

		Logger.info('Database connection closed.')
	} catch (error) {
		Logger.error('Failed to close database connection.', error)
	}

	Logger.info('Exiting.')

	process.exit(exitCode)
}

export default OnShutdown
