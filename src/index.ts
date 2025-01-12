import { DependencyInjection } from '@celosiajs/core'

import DatabaseRepository from 'Repositories/DatabaseRepository'

import Logger from 'Utils/Logger/Logger'
import OnShutdown from 'Utils/OnShutdown/OnShutdown'

import Instance from './App'

export const Port = parseInt(process.env.PORT || '8080', 10)

Instance.addErrorHandler()

await DependencyInjection.get(DatabaseRepository).connect()

await Instance.listen({ port: Port, host: '0.0.0.0' })

Logger.info('Server running.', {
	port: Port,
	pid: process.pid,
	env: process.env.NODE_ENV,
})

// Graceful Shutdown
process.on('SIGTERM', () => void OnShutdown('SIGTERM'))
process.on('SIGINT', () => void OnShutdown('SIGINT'))
