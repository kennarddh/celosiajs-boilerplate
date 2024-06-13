/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from 'zod'

import { ExpressRequest, ExpressResponse } from 'Internals'

const emptyZodObject = z.object({})

abstract class BaseController<
	// eslint-disable-next-line @typescript-eslint/ban-types
	T extends Record<string, any> = {},
	Request extends ExpressRequest<any, any, any, any> = ExpressRequest<any, any, any, any>,
	Response extends ExpressResponse<any> = ExpressResponse<any>,
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
