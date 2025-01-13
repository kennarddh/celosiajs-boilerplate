import { Logger as WinstonLogger } from 'winston'

import Logger from 'Utils/Logger/Logger'

abstract class ConfigurationProvider<T> {
	protected logger: WinstonLogger

	constructor(protected loggingSource: string) {
		this.logger = Logger.child({ source: loggingSource })
	}

	abstract load(): Promise<T>
}

export default ConfigurationProvider
