import { ApplicationConfiguration } from '../ConfigurationService'
import ConfigurationProvider from './ConfigurationProvider'

class EnvironmentConfigurationProvider extends ConfigurationProvider<ApplicationConfiguration> {
	constructor() {
		super('EnvironmentConfigurationProvider')
	}

	async load(): Promise<ApplicationConfiguration> {
		return {
			nodeEnv: process.env.NODE_ENV,
			port: parseInt(process.env.PORT, 10),
			databaseUrl: process.env.DATABASE_URL,
			logLevel: process.env.LOG_LEVEL,
			tokens: {
				access: {
					secret: process.env.ACCESS_TOKEN_SECRET,
					expire: parseInt(process.env.ACCESS_TOKEN_EXPIRE, 10),
				},
				refresh: {
					secret: process.env.REFRESH_TOKEN_SECRET,
					expire: parseInt(process.env.REFRESH_TOKEN_EXPIRE, 10),
				},
			},
			rateLimiter: {
				max: parseInt(process.env.RATE_LIMITER_MAX, 10),
				window: parseInt(process.env.RATE_LIMITER_WINDOW, 10),
			},
			passwordHash: {
				secret: process.env.PASSWORD_HASH_SECRET,
			},
			corsOrigin: process.env.CORS_ORIGIN.split(','),
		}
	}
}

export default EnvironmentConfigurationProvider
