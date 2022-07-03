import winston from 'winston'

import WinstonDailyRotateFile from 'winston-daily-rotate-file'

import path from 'path'

const logsRootDirectory = path.resolve(
	path.dirname(require.main.filename),
	'../Logs'
)

const RemoveError = winston.format(info => {
	return info.level !== 'error' ? info : false
})

const RemoveWarn = winston.format(info => {
	return info.level !== 'warn' ? info : false
})

const RemoveInfo = winston.format(info => {
	return info.level !== 'info' ? info : false
})

const LoggerFormat = [
	winston.format.timestamp(),
	winston.format.metadata(),
	winston.format.ms(),
	winston.format.json(),
]

const Logger = winston.createLogger({
	level: process.env.LOG_LEVEL || 'info',
	silent: process.env.NODE_ENV === 'test',
	format: winston.format.combine(...LoggerFormat),
	transports: [
		new winston.transports.Console({
			silent: process.env.NODE_ENV !== 'development',
		}),
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
			handleRejections: true,
		}),
		new WinstonDailyRotateFile({
			dirname: path.resolve(logsRootDirectory, 'Http'),
			level: 'http',
			filename: 'Http.log-%DATE%',
			zippedArchive: true,
			maxSize: '1m',
			maxFiles: '14d',
			format: winston.format.combine(
				RemoveError(),
				RemoveWarn(),
				RemoveInfo(),
				...LoggerFormat
			),
		}),
	],
})

export default Logger
