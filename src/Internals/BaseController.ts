import { JSON } from 'Types/JSON'
import { z } from 'zod'

import BaseRequest from './Providers/Base/BaseRequest'
import BaseResponse from './Providers/Base/BaseResponse'

const emptyZodObject = z.object({})

abstract class BaseController<
	T extends Record<string, any> = {},
	Request extends BaseRequest<any, any, any, any> = BaseRequest,
	Response extends BaseResponse<any> = BaseResponse<JSON>,
> {
	public abstract index(data: T, request: Request, response: Response): void

	public get body() {
		return emptyZodObject
	}

	public get query() {
		return emptyZodObject
	}

	public get params() {
		return emptyZodObject
	}

	public get cookies() {
		return emptyZodObject
	}
}

export default BaseController
