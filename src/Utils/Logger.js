import winston from 'winston'

const Logger = winston.createLogger({
	level: process.env.LOG_LEVEL || 'info',
	transports: [new winston.transports.Console({})],
})

export default Logger
