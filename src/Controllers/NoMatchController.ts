import { BaseController, CelosiaRequest, CelosiaResponse, EmptyObject } from '@celosiajs/core'

class NoMatchController extends BaseController {
	public override index(_: EmptyObject, __: CelosiaRequest, response: CelosiaResponse): void {
		response.status(404).json({
			errors: { others: ['Not found'] },
			data: {},
		})
	}
}

export default NoMatchController
