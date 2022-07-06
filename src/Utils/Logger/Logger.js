import winston from 'winston'

import WinstonDailyRotateFile from 'winston-daily-rotate-file'

import path from 'path'

// Utils
import GetRootDirectory from '../GetRootDirectory'

// Format
import RemoveError from './Format/RemoveError'
import RemoveWarn from './Format/RemoveWarn'
import RemoveInfo from './Format/RemoveInfo'
import RemoveHttp from './Format/RemoveHttp'

const logsRootDirectory = path.resolve(GetRootDirectory(), 'Logs')

const LoggerFormat = [
	winston.format.timestamp(),
	winston.format.metadata(),
	winston.format.ms(),
	winston.format.json(),
]

const Transports = [
	new winston.transports.Console({
		silent: process.env.NODE_ENV !== 'development',
	}),
]

if (process.env.NODE_ENV === 'development') {
	Transports.push(
		new WinstonDailyRotateFile({
			dirname: path.resolve(logsRootDirectory, 'Debug'),
			level: 'debug',
			filename: 'Debug.log-%DATE%',
			zippedArchive: true,
			maxSize: '1m',
			maxFiles: '14d',
			format: winston.format.combine(RemoveHttp(), ...LoggerFormat),
			silent: process.env.NODE_ENV !== 'development',
		})
	)
}

if (process.env.NODE_ENV !== 'test') {
	Transports.push(
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
		})
	)
}

const Logger = winston.createLogger({
	level: process.env.LOG_LEVEL || 'info',
	silent: process.env.NODE_ENV === 'test',
	format: winston.format.combine(...LoggerFormat),
	transports: Transports,
})

export default Logger
