/* eslint-disable security/detect-object-injection */
import winston from 'winston'

import { Format } from 'logform'
import { MESSAGE, SPLAT } from 'triple-beam'
import util, { InspectOptions } from 'util'

const CustomFormatter: (opts: {
	inspectOptions?: InspectOptions
	levelPadLength?: number
	timestamp?: boolean
}) => Format = winston.format(
	(
		info,
		{
			inspectOptions,
			timestamp = true,
			levelPadLength = 7,
		}: { inspectOptions?: InspectOptions; levelPadLength?: number; timestamp?: boolean },
	) => {
		let message = ''

		if (timestamp) {
			const timestampString = new Date().toLocaleString()

			message += `${timestampString} | `
		}

		message += `${info.level.padEnd(levelPadLength, ' ')}: ${info.message}`

		if (info.ms) {
			message += ` ${info.ms}`
		}

		for (const splat of info[SPLAT]) {
			message += `\n${util.inspect(splat, inspectOptions)}`
		}

		info[MESSAGE] = message

		return info
	},
)

export default CustomFormatter
