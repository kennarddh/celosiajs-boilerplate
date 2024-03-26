import express, { Request, Response } from 'express'

import BaseController, { IControllerRequest, IRequest } from './BaseController'
import BaseMiddleware from './BaseMiddleware'

type MiddlewareArray = BaseMiddleware<any, any, any>[]

type ValidateMiddlewares<
	Controller extends BaseController<any>,
	T extends MiddlewareArray,
	Input extends Record<string, any> = Record<string, never>,
	Results extends any[] = [],
> = T extends [
	BaseMiddleware<IControllerRequest<Controller>, Input, infer Output>,
	...infer Tail extends MiddlewareArray,
]
	? ValidateMiddlewares<Controller, Tail, Input & Output, [...Results, T[0]]>
	: T extends [
				BaseMiddleware<IRequest<any, any, any, any>, any, infer Output>,
				...infer Tail extends MiddlewareArray,
		  ]
		? ValidateMiddlewares<
				Controller,
				Tail,
				Input,
				[...Results, BaseMiddleware<IControllerRequest<Controller>, Input, Output>]
			>
		: Results

type MergeMiddlewaresOutput<
	T extends MiddlewareArray,
	Input extends Record<string, any> = {},
> = T extends [BaseMiddleware<any, any, infer Output>, ...infer Tail extends MiddlewareArray]
	? MergeMiddlewaresOutput<Tail, Output & Input>
	: Input

type ValidateController<
	Controller extends BaseController<any>,
	Middlewares extends MiddlewareArray | [],
> =
	Controller extends BaseController<infer Data>
		? MergeMiddlewaresOutput<Middlewares> extends Data
			? Controller
			: never
		: never

class Router {
	private router = express.Router()

	get<Controller extends BaseController<any>, Middlewares extends MiddlewareArray>(
		path: string,
		middlewares: Middlewares & ValidateMiddlewares<Controller, Middlewares>,
		controller: Controller & ValidateController<Controller, Middlewares>,
	) {
		this.router.get(path, this.handler(middlewares, controller))
	}

	private handler<Controller extends BaseController<any>, Middlewares extends BaseMiddleware[]>(
		middlewares: Middlewares,
		controller: Controller,
	) {
		return async (request: Request, response: Response) => {
			const parsedBody = await controller.body.safeParseAsync(request.body)
			const parsedQuery = await controller.query.safeParseAsync(request.query)
			const parsedParams = await controller.params.safeParseAsync(request.params)
			const parsedCookies = await controller.cookies.safeParseAsync(request.cookies)

			const errors: {
				parsing: {
					body?: Record<string, string[]>
					query?: Record<string, string[]>
					params?: Record<string, string[]>
					cookies?: Record<string, string[]>
				}
				others?: string[]
			} = { parsing: {} }

			if (!parsedBody.success) {
				errors.parsing.body = parsedBody.error.format()
			}

			if (!parsedQuery.success) {
				errors.parsing.query = parsedQuery.error.format()
			}

			if (!parsedParams.success) {
				errors.parsing.params = parsedParams.error.format()
			}

			if (!parsedCookies.success) {
				errors.parsing.cookies = parsedCookies.error.format()
			}

			if (
				!(
					parsedBody.success &&
					parsedQuery.success &&
					parsedParams.success &&
					parsedCookies.success
				)
			)
				return response.status(400).json({
					data: {},
					errors,
				})

			const newRequest: IRequest = {
				body: parsedBody.data,
				query: parsedQuery.data,
				params: parsedParams.data,
				cookies: parsedCookies.data,
			}

			let data = {}

			for (const middleware of middlewares) {
				try {
					data = await middleware.index(data, newRequest, response)
				} catch {
					if (!response.writableEnded) {
						response.status(500).json({
							data: {},
							errors: {
								others: ['Internal Server Error'],
							},
						})
					}

					return
				}
			}

			controller.index(data, newRequest, response)

			return
		}
	}
}

export default Router
