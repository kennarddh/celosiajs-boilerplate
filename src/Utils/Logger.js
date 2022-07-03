import winston from 'winston'

import WinstonDailyRotateFile from 'winston-daily-rotate-file'

import path from 'path'

const logsRootDirectory = path.resolve(
	path.dirname(require.main.filename),
	'../Logs'
)

const Logger = winston.createLogger({
	level: process.env.LOG_LEVEL || 'info',
	silent: process.NODE_ENV === 'test',
	format: winston.format.combine(
		winston.format.timestamp(),
		winston.format.metadata(),
		winston.format.ms(),
		winston.format.json()
	),
	transports: [
		new winston.transports.Console({}),
		new WinstonDailyRotateFile({
			dirname: path.resolve(logsRootDirectory, 'Application'),
			filename: 'Application-%DATE%.log',
			zippedArchive: true,
			maxSize: '1m',
			maxFiles: '14d',
		}),
		new WinstonDailyRotateFile({
			dirname: path.resolve(logsRootDirectory, 'Error'),
			level: 'error',
			filename: 'Error.log-%DATE%',
			zippedArchive: true,
			maxSize: '1m',
			maxFiles: '14d',
			handleExceptions: true,
		}),
	],
})

export default Logger
