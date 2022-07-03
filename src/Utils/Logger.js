import winston from 'winston'

const Logger = winston.createLogger({
	level: process.env.LOG_LEVEL || 'info',
	transports: [new winston.transports.Console({})],
	format: winston.format.combine(
		winston.format.timestamp(),
		winston.format.metadata(),
		winston.format.ms(),
		winston.format.json()
	),
})

export default Logger
