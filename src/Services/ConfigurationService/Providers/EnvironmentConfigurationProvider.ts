import { ApplicationConfiguration } from '../ConfigurationService'
import ConfigurationProvider from './ConfigurationProvider'

class EnvironmentConfigurationProvider extends ConfigurationProvider<ApplicationConfiguration> {
	constructor() {
		super('EnvironmentConfigurationProvider')
	}

	async load(): Promise<ApplicationConfiguration> {
		return { a: '1' }
	}
}

export default EnvironmentConfigurationProvider
