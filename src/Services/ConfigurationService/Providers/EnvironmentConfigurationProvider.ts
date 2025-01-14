import { ApplicationConfiguration } from '../ConfigurationService'
import ConfigurationProvider from './ConfigurationProvider'

class EnvironmentConfigurationProvider extends ConfigurationProvider<ApplicationConfiguration> {
	constructor() {
		super('EnvironmentConfigurationProvider')
	}

	async load(): Promise<ApplicationConfiguration> {
		return {
			nodeEnv: process.env.NODE_ENV,
			host: process.env.HOST,
			port: parseInt(process.env.PORT, 10),
			databaseUrl: process.env.DATABASE_URL,
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
			logging: {
				level: process.env.LOG_LEVEL,
				path: process.env.LOG_PATH,
			},
		}
	}
}

export default EnvironmentConfigurationProvider
