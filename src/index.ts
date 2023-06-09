import 'dotenv/config'

import App from 'App'

import Logger from 'Utils/Logger/Logger'
import OnShutdown from 'Utils/OnShutdown/OnShutdown'

const PORT = process.env.PORT || 8080

const server = App.listen(PORT, () =>
	Logger.info(`Server running`, {
		port: PORT,
		pid: process.pid,
		env: process.env.NODE_ENV,
	})
)

// Graceful Shutdown
process.on('SIGTERM', OnShutdown(server, PORT, 'SIGTERM'))
process.on('SIGINT', OnShutdown(server, PORT, 'SIGINT'))
