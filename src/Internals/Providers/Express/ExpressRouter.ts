import express, { Request, Response } from 'express'

import BaseController from '../../BaseController'
import BaseMiddleware from '../../BaseMiddleware'
import { EmptyObject, MiddlewareArray, ValidateController, ValidateMiddlewares } from '../../Types'
import BaseRequest from '../Base/BaseRequest'
import BaseResponse from '../Base/BaseResponse'
import BaseRouter from '../Base/BaseRouter'
import ExpressRequest from './ExpressRequest'
import ExpressResponse from './ExpressResponse'

class ExpressRouter extends BaseRouter {
	private _expressRouter = express.Router()

	public get expressRouter() {
		return this._expressRouter
	}

	public useRouters(path: string, ...routers: ExpressRouter[]): this {
		routers.forEach(router => {
			this._expressRouter.use(path, router.expressRouter)
		})

		return this
	}

	/**
	 * For middlewares without any input or output
	 */
	public useMiddlewares(
		...middlewares: BaseMiddleware<
			BaseRequest<EmptyObject, EmptyObject, EmptyObject, EmptyObject>,
			BaseResponse,
			EmptyObject
		>[]
	): this {
		middlewares.forEach(middleware => {
			this._expressRouter.use((request, response, next) => {
				const newRequest = new ExpressRequest(request)
				const newResponse = new ExpressResponse(response)

				middleware.index({}, newRequest, newResponse).then(() => {
					next()
				})
			})
		})

		return this
	}

	public get<Controller extends BaseController<any>, Middlewares extends MiddlewareArray>(
		path: string,
		middlewares: Middlewares & ValidateMiddlewares<Controller, Middlewares>,
		controller: Controller & ValidateController<Controller, Middlewares>,
	) {
		this._expressRouter.get(path, this.handler(middlewares, controller))

		return this
	}

	public post<Controller extends BaseController<any>, Middlewares extends MiddlewareArray>(
		path: string,
		middlewares: Middlewares & ValidateMiddlewares<Controller, Middlewares>,
		controller: Controller & ValidateController<Controller, Middlewares>,
	) {
		this._expressRouter.post(path, this.handler(middlewares, controller))

		return this
	}

	public put<Controller extends BaseController<any>, Middlewares extends MiddlewareArray>(
		path: string,
		middlewares: Middlewares & ValidateMiddlewares<Controller, Middlewares>,
		controller: Controller & ValidateController<Controller, Middlewares>,
	) {
		this._expressRouter.put(path, this.handler(middlewares, controller))

		return this
	}

	public patch<Controller extends BaseController<any>, Middlewares extends MiddlewareArray>(
		path: string,
		middlewares: Middlewares & ValidateMiddlewares<Controller, Middlewares>,
		controller: Controller & ValidateController<Controller, Middlewares>,
	) {
		this._expressRouter.patch(path, this.handler(middlewares, controller))

		return this
	}

	public delete<Controller extends BaseController<any>, Middlewares extends MiddlewareArray>(
		path: string,
		middlewares: Middlewares & ValidateMiddlewares<Controller, Middlewares>,
		controller: Controller & ValidateController<Controller, Middlewares>,
	) {
		this._expressRouter.delete(path, this.handler(middlewares, controller))

		return this
	}

	public options<Controller extends BaseController<any>, Middlewares extends MiddlewareArray>(
		path: string,
		middlewares: Middlewares & ValidateMiddlewares<Controller, Middlewares>,
		controller: Controller & ValidateController<Controller, Middlewares>,
	) {
		this._expressRouter.options(path, this.handler(middlewares, controller))

		return this
	}

	public all<Controller extends BaseController<any>, Middlewares extends MiddlewareArray>(
		path: string,
		middlewares: Middlewares & ValidateMiddlewares<Controller, Middlewares>,
		controller: Controller & ValidateController<Controller, Middlewares>,
	) {
		this._expressRouter.all(path, this.handler(middlewares, controller))

		return this
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

			const newRequest = new ExpressRequest(request)
			const newResponse = new ExpressResponse(response)

			let data = {}

			for (const middleware of middlewares) {
				try {
					const output = await middleware.index(data, newRequest, newResponse)

					data = output ?? {}
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

			controller.index(data, newRequest, newResponse)

			return
		}
	}
}

export default ExpressRouter
