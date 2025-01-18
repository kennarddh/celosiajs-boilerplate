import {
	CelosiaRequest,
	CelosiaResponse,
	Controller,
	DependencyInjection,
	EmptyObject,
} from '@celosiajs/core'

import DatabaseRepository from 'Repositories/DatabaseRepository'

import ConfigurationService from 'Services/ConfigurationService/ConfigurationService'

class HealthController extends Controller {
	constructor(
		private databaseRepository = DependencyInjection.get(DatabaseRepository),
		private configurationService = DependencyInjection.get(ConfigurationService),
	) {
		super('HealthController')
	}

	public override async index(_: EmptyObject, __: CelosiaRequest, response: CelosiaResponse) {
		if (this.configurationService.loaded && (await this.databaseRepository.isReady())) {
			return response.sendStatus(204)
		}

		response.sendStatus(503)
	}
}

export default HealthController
