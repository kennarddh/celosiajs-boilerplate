import { BaseService, DependencyScope, Injectable } from '@celosiajs/core'

import { mergician } from 'mergician'

import ConfigurationProvider from './Providers/ConfigurationProvider'
import EnvironmentConfigurationProvider from './Providers/EnvironmentConfigurationProvider'

export interface ApplicationConfiguration {
	nodeEnv: string
	port: number
	databaseUrl: string
	logLevel: string
	tokens: {
		access: {
			secret: string
			expire: number
		}
		refresh: {
			secret: string
			expire: number
		}
	}
	rateLimiter: {
		max: number
		window: number
	}
	passwordHash: {
		secret: string
	}
	corsOrigin: string[]
}

@Injectable(DependencyScope.Singleton)
class ConfigurationService extends BaseService {
	public configurations: ApplicationConfiguration = {} as ApplicationConfiguration

	constructor() {
		super('ConfigurationService')
	}

	public async load() {
		this.logger.info('Loading.')

		const configurations = await Promise.all([
			this.loadProvider(new EnvironmentConfigurationProvider()),
		])

		this.loadConfigurations(configurations)

		this.logger.info('Loaded.')
	}

	public async loadProvider(
		configurationProvider: ConfigurationProvider<ApplicationConfiguration>,
	) {
		return await configurationProvider.load()
	}

	public loadConfigurations(configurations: ApplicationConfiguration[]) {
		this.configurations = mergician(
			this.configurations,
			...configurations,
		) as ApplicationConfiguration
	}
}

export default ConfigurationService
