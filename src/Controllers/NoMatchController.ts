import BaseController from 'Internals/BaseController'
import { ExpressRequest, ExpressResponse } from 'Internals/ExpressProvider'
import { EmptyObject } from 'Internals/Types'

class NoMatchController extends BaseController {
	public override index(_: EmptyObject, __: ExpressRequest, response: ExpressResponse): void {
		response.status(404).json({
			errors: ['Not found'],
			data: {},
		})
	}
}

export default NoMatchController
