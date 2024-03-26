import { z } from 'zod'

import { IControllerRequest, IControllerResponse } from './Types'

const emptyZodObject = z.object({})

abstract class BaseController<T extends Record<string, any> = {}> {
	public abstract index(
		data: T,
		request: IControllerRequest<any>,
		response: IControllerResponse,
	): void

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
