import { z } from 'zod'

import { DependencyScope, Injectable, Service } from '@celosiajs/core'

import { mergician } from 'mergician'

import ConfigurationProvider from './Providers/ConfigurationProvider'
import EnvironmentConfigurationProvider from './Providers/EnvironmentConfigurationProvider'

export const ApplicationConfigurationSchema = z.object({
	nodeEnv: z.string(),
	host: z.string(),
	port: z.number(),
	databaseUrl: z.string(),
	logLevel: z.string(),
	tokens: z.object({
		access: z.object({
			secret: z.string(),
			expire: z.number(),
		}),
		refresh: z.object({
			secret: z.string(),
			expire: z.number(),
		}),
	}),
	rateLimiter: z.object({
		max: z.number(),
		window: z.number(),
	}),
	passwordHash: z.object({
		secret: z.string(),
	}),
	corsOrigin: z.string().array(),
})

export type ApplicationConfiguration = z.infer<typeof ApplicationConfigurationSchema>

@Injectable(DependencyScope.Singleton)
class ConfigurationService extends Service {
	protected _loaded = false

	public configurations: ApplicationConfiguration = {} as ApplicationConfiguration

	constructor() {
		super('ConfigurationService')
	}

	public get loaded() {
		return this._loaded
	}

	public async load() {
		this.logger.info('Loading.')

		const configurations = await Promise.all([
			this.loadProvider(new EnvironmentConfigurationProvider()),
		])

		this.loadConfigurations(configurations)

		const parseResult = await ApplicationConfigurationSchema.safeParseAsync(this.configurations)

		if (!parseResult.success) {
			this.logger.error(
				'ConfiguratioService load failed due to invalid configurations',
				parseResult.error.format(),
			)

			throw parseResult.error
		}

		this.configurations = parseResult.data

		this._loaded = true

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
