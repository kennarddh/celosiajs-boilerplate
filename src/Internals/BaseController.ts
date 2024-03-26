import { Request, Response } from 'express'

import { JSON } from 'Types/JSON'
import { z } from 'zod'

export type IControllerRequest<Controller extends BaseController<any>> = IRequest<
	z.infer<Controller['body']>,
	z.infer<Controller['query']>,
	z.infer<Controller['params']>,
	z.infer<Controller['cookies']>
>

export interface IRequest<
	Body extends Record<string, any> = Record<PropertyKey, never>,
	Query extends Record<string, any> = Record<PropertyKey, never>,
	Params extends Record<string, any> = Record<PropertyKey, never>,
	Cookies extends Record<string, any> = Record<PropertyKey, never>,
> {
	body: {} extends Body ? Record<PropertyKey, never> : Body
	query: {} extends Query ? Record<PropertyKey, never> : Query
	params: {} extends Params ? Record<PropertyKey, never> : Params
	cookies: {} extends Cookies ? Record<PropertyKey, never> : Cookies
}

export type IControllerResponse = Response<JSON>

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
