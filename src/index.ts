import 'dotenv/config'

import Instance from 'App'

import Logger from 'Utils/Logger/Logger'
import OnShutdown from 'Utils/OnShutdown/OnShutdown'

export const Port = parseInt(process.env.PORT || '8080', 10)

Instance.addErrorHandler()

await Instance.listen({ port: Port })

Logger.info(`Server running`, {
	port: Port,
	pid: process.pid,
	env: process.env.NODE_ENV,
})

// Graceful Shutdown
// eslint-disable-next-line @typescript-eslint/no-misused-promises
process.on('SIGTERM', OnShutdown('SIGTERM'))
// eslint-disable-next-line @typescript-eslint/no-misused-promises
process.on('SIGINT', OnShutdown('SIGINT'))
