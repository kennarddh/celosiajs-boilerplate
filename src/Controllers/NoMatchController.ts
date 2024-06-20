import { BaseController, EmptyObject, ExpressRequest, ExpressResponse } from 'Internals'

class NoMatchController extends BaseController {
	public override index(_: EmptyObject, __: ExpressRequest, response: ExpressResponse): void {
		response.status(404).json({
			errors: { others: ['Not found'] },
			data: {},
		})
	}
}

export default NoMatchController
