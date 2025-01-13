import { BaseService, DependencyScope, Injectable } from '@celosiajs/core'

import { mergician } from 'mergician'

import ConfigurationProvider from './Providers/ConfigurationProvider'
import EnvironmentConfigurationProvider from './Providers/EnvironmentConfigurationProvider'

export interface ApplicationConfiguration {
	a: string
}

@Injectable(DependencyScope.Singleton)
class ConfigurationService extends BaseService {
	configurations: ApplicationConfiguration = {} as ApplicationConfiguration

	constructor() {
		super('ConfigurationService')
	}

	public async loadProviders() {
		const configurations = await Promise.all([
			this.loadProvider(new EnvironmentConfigurationProvider()),
		])

		this.loadConfigurations(configurations)
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
