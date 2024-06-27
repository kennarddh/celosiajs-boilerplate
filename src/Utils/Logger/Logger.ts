/* eslint-disable @typescript-eslint/no-unsafe-assignment */

/* eslint-disable security/detect-object-injection */
import path from 'path'

import winston from 'winston'
import WinstonDailyRotateFile from 'winston-daily-rotate-file'

import { MESSAGE } from 'triple-beam'

// Utils
import GetRootDirectory from 'Utils/GetRootDirectory'

// Format
import RemoveError from './Format/RemoveError'
import RemoveHttp from './Format/RemoveHttp'
import RemoveInfo from './Format/RemoveInfo'
import RemoveWarn from './Format/RemoveWarn'

const logsRootDirectory = path.resolve(GetRootDirectory(), 'Logs')

const customTimestampFormatter = winston.format(info => {
	return { ...info, timestamp: new Date().toLocaleString() }
})

const customFormatter = winston.format(info => {
	const {
		message: _,
		splat: __,
		level: ___,
		stack: ____,
		timestamp: _____,
		ms: ______,
		...restInfo
	} = info

	const stringifiedInfo = JSON.stringify(restInfo, null, 2)

	let message = `${info.timestamp} | ${info.level.padEnd(7, ' ')}: ${info.message}`

	if (info.ms) {
		message += ` ${info.ms}`
	}

	if (stringifiedInfo !== '{}') {
		message += ` ${stringifiedInfo}`
	}

	if (info.stack) {
		message += `\n${info.stack}`
	}

	info[MESSAGE] = message

	return info
})

const LoggerFormat = [
	winston.format.errors({ stack: true }),
	customTimestampFormatter(),
	winston.format.ms(),
	customFormatter(),
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
			// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
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
