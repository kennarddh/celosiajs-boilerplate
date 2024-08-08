// import 'dotenv/config'
// import Instance from 'App'
import Logger from 'Utils/Logger/Logger'

// import OnShutdown from 'Utils/OnShutdown/OnShutdown'

// Logger.error('unknown error occured', new Error('ABC'), { id: 1 })
Logger.error('unknown error occured', new Error('ABC'), new Error('TWO'), {
	id: 111,
	b: { c: { d: { e: 1 } } },
})

// [error] unknown error occured
// Error: ABC
// at index.ts:8...

// [error] unknown error occured ABC
// Error: ABC
// at index.ts:8...

// message = unknown error occured ABC CBA, AAA
// splat = ABC

// message = unknown error occured ABC
// splat = [Error(ABC)]

// [error]: DB fail to connect PrismaUserError $1111. Please check your database connection.
// Stack: PrismaUserError $1111. Please check your database connection. at prima.js:100101
// at index.ts:20

// export const Port = parseInt(process.env.PORT || '8080', 10)

// Instance.addErrorHandler()

// await Instance.listen({ port: Port })

// Logger.info(`Server running`, {
// 	port: Port,
// 	pid: process.pid,
// 	env: process.env.NODE_ENV,
// })

// Graceful Shutdown
// process.on('SIGTERM', () => void OnShutdown('SIGTERM'))
// process.on('SIGINT', () => void OnShutdown('SIGINT'))
