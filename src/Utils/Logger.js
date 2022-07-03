import winston from 'winston'

const Logger = winston.createLogger({
	transports: [new winston.transports.Console({})],
})

export default Logger
