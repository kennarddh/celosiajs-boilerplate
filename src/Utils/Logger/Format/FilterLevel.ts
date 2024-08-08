import winston from 'winston'

import { Format } from 'logform'

const FilterLevel: (opts: { list: string[]; isWhitelist: boolean }) => Format = winston.format(
	(info, opts: { list: string[]; isWhitelist: boolean }) => {
		if (opts.list.includes(info.level)) {
			if (opts.isWhitelist) return info
			else return false
		}

		return info
	},
)

export default FilterLevel
