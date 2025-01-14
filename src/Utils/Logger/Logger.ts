import path from 'path'

import winston from 'winston'
import WinstonDailyRotateFile from 'winston-daily-rotate-file'

import { Globals } from '@celosiajs/core'
import { CelosiaFormat, FilterLevel } from '@celosiajs/logging'

// This file use process.env because the ConfigurationService itself require Logger.
// Preventing cyclical import.

const logsRootDirectory = path.resolve(process.env.LOG_PATH)

const LoggerFormat = [winston.format.ms(), CelosiaFormat({ inspectOptions: { depth: Infinity } })]

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
			format: winston.format.combine(
				FilterLevel({ list: ['http'], isWhitelist: false }),
				...LoggerFormat,
			),
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
				FilterLevel({ list: ['http'], isWhitelist: true }),
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

Globals.logger = Logger

export default Logger
