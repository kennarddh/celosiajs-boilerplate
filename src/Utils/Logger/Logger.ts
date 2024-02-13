import path from 'path'

import winston from 'winston'
import WinstonDailyRotateFile from 'winston-daily-rotate-file'

// Utils
import GetRootDirectory from 'Utils/GetRootDirectory.js'

// Format
import RemoveError from './Format/RemoveError.js'
import RemoveHttp from './Format/RemoveHttp.js'
import RemoveInfo from './Format/RemoveInfo.js'
import RemoveWarn from './Format/RemoveWarn.js'

const logsRootDirectory = path.resolve(GetRootDirectory(), 'Logs')

const LoggerFormat = [
	winston.format.timestamp(),
	winston.format.metadata(),
	winston.format.ms(),
	winston.format.json(),
]

const transports = []

if (process.env.NODE_ENV === 'development') {
	transports.push(
		new WinstonDailyRotateFile({
			dirname: path.resolve(logsRootDirectory, 'Debug'),
			level: 'debug',
			filename: 'Debug.log-%DATE%.log',
			zippedArchive: true,
			maxSize: '1m',
			maxFiles: '14d',
			format: winston.format.combine(RemoveHttp(), ...LoggerFormat),
			silent: process.env.NODE_ENV !== 'development',
		}),
	)
}

if (process.env.NODE_ENV !== 'test') {
	transports.push(
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
			filename: 'Error.log-%DATE%.log',
			zippedArchive: true,
			maxSize: '1m',
			maxFiles: '14d',
			handleExceptions: true,
			handleRejections: true,
		}),
		new WinstonDailyRotateFile({
			dirname: path.resolve(logsRootDirectory, 'Http'),
			level: 'http',
			filename: 'Http.log-%DATE%.log',
			zippedArchive: true,
			maxSize: '1m',
			maxFiles: '14d',
			format: winston.format.combine(
				RemoveError(),
				RemoveWarn(),
				RemoveInfo(),
				...LoggerFormat,
			),
		}),
		new winston.transports.Console(),
	)
}

const Logger = winston.createLogger({
	level: process.env.LOG_LEVEL || 'info',
	silent: process.env.NODE_ENV === 'test',
	format: winston.format.combine(...LoggerFormat),
	transports,
})

export default Logger
