import { Globals } from '@celosiajs/core'

import Instance from 'App'

import Logger from 'Utils/Logger/Logger'
import OnShutdown from 'Utils/OnShutdown/OnShutdown'

export const Port = parseInt(process.env.PORT || '8080', 10)

Globals.logger = Logger

Instance.addErrorHandler()

await Instance.listen({ port: Port })

Logger.info(`Server running`, {
	port: Port,
	pid: process.pid,
	env: process.env.NODE_ENV,
})

// Graceful Shutdown
process.on('SIGTERM', () => void OnShutdown('SIGTERM'))
process.on('SIGINT', () => void OnShutdown('SIGINT'))
