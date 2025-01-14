import { CelosiaRequest, CelosiaResponse, Controller, EmptyObject } from '@celosiajs/core'

class NoMatchController extends Controller {
	constructor() {
		super('NoMatchController')
	}

	public override index(_: EmptyObject, __: CelosiaRequest, response: CelosiaResponse): void {
		response.status(404).json({
			errors: { others: ['Not found'] },
			data: {},
		})
	}
}

export default NoMatchController
