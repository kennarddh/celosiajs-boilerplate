import BaseInstance from 'Internals/Providers/Base/BaseInstance'
import ExpressInstance from 'Internals/Providers/Express/ExpressInstance'
import 'dotenv/config'

import Logger from 'Utils/Logger/Logger'

export const Port = parseInt(process.env.PORT || '8080', 10)

export const Instance = new ExpressInstance() as BaseInstance

await Instance.listen({ port: Port })

Logger.info(`Server running`, {
	port: Port,
	pid: process.pid,
	env: process.env.NODE_ENV,
})

// Graceful Shutdown
// process.on('SIGTERM', OnShutdown('SIGTERM'))
// process.on('SIGINT', OnShutdown('SIGINT'))
