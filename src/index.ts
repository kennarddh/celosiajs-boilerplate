import App from 'App.js'
import 'dotenv/config'

import Logger from 'Utils/Logger/Logger.js'
import OnShutdown from 'Utils/OnShutdown/OnShutdown.js'

export const Port = parseInt(process.env.PORT || '8080', 10)

export const ServerApp = App.listen(Port, () =>
	Logger.info(`Server running`, {
		port: Port,
		pid: process.pid,
		env: process.env.NODE_ENV,
	}),
)

// Graceful Shutdown
process.on('SIGTERM', OnShutdown('SIGTERM'))
process.on('SIGINT', OnShutdown('SIGINT'))
