import 'dotenv/config'

import App from 'App'

import Logger from 'Utils/Logger/Logger'
import OnShutdown from 'Utils/OnShutdown/OnShutdown'

const port = parseInt(process.env.PORT || '8080', 10)

const server = App.listen(port, () =>
	Logger.info(`Server running`, {
		port,
		pid: process.pid,
		env: process.env.NODE_ENV,
	}),
)

// Graceful Shutdown
process.on('SIGTERM', OnShutdown(server, port, 'SIGTERM'))
process.on('SIGINT', OnShutdown(server, port, 'SIGINT'))
