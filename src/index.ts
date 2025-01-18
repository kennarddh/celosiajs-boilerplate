import { DependencyInjection } from '@celosiajs/core'

import Logger from 'Utils/Logger/Logger'

import ConfigurationService from 'Services/ConfigurationService/ConfigurationService'

const configurationService = DependencyInjection.get(ConfigurationService)

try {
	await configurationService.load()
} catch {
	process.exit(1)
}

const { default: DatabaseRepository } = await import('Repositories/DatabaseRepository')
const { default: Instance } = await import('./App')
const { default: OnShutdown } = await import('Utils/OnShutdown/OnShutdown')

await Promise.all([DependencyInjection.get(DatabaseRepository).connect()])

await Instance.listen({
	port: configurationService.configurations.port,
	host: configurationService.configurations.host,
})

Logger.info('Server running.', {
	port: configurationService.configurations.port,
	pid: process.pid,
	env: configurationService.configurations.nodeEnv,
})

// Graceful Shutdown
process.on('SIGTERM', () => void OnShutdown('SIGTERM'))
process.on('SIGINT', () => void OnShutdown('SIGINT'))
