/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { NextFunction, Request, Response } from 'express'

import {
	BaseController,
	BaseMiddleware,
	ExpressRequest,
	ExpressResponse,
	MiddlewareArray,
	NoInputMiddleware,
	StopHere,
	ValidateController,
	ValidateControllerWithoutBody,
	ValidateMiddlewares,
} from 'Internals'

import Logger from 'Utils/Logger/Logger'

export interface RouterConstructorOptions<Strict extends boolean = true> {
	strict: Strict
}

export type RouterGroupCallback<Strict extends boolean> = (router: ExpressRouter<Strict>) => void

class ExpressRouter<Strict extends boolean = true> {
	protected _isStrict: Strict
	private _expressRouter = express.Router()

	constructor(options: RouterConstructorOptions<Strict>) {
		this._isStrict = options.strict
	}

	public get isStrict(): Strict {
		return this._isStrict
	}

	public get expressRouter() {
		return this._expressRouter
	}

	public useRouters(path: string, ...routers: [ExpressRouter<any>, ...ExpressRouter<any>[]]): this
	public useRouters(...routers: [ExpressRouter<any>, ...ExpressRouter<any>[]]): this
	public useRouters(
		...routersAndPath: [string | ExpressRouter<any>, ...(string | ExpressRouter<any>)[]]
	): this {
		const possiblyPath = routersAndPath[0]
		const path = typeof possiblyPath === 'string' ? possiblyPath : null

		const routers = (
			path === null ? routersAndPath : routersAndPath.filter((_, index) => index !== 0)
		) as ExpressRouter[]

		routers.forEach(router => {
			if (path === null) this._expressRouter.use(router.expressRouter)
			else this._expressRouter.use(path, router.expressRouter)
		})

		return this
	}

	/**
	 * For middlewares without any input or output
	 */
	public useMiddlewares(
		path: string,
		...middlewares: [NoInputMiddleware, ...NoInputMiddleware[]]
	): this

	/**
	 * For middlewares without any input or output
	 */
	public useMiddlewares(...middlewares: [NoInputMiddleware, ...NoInputMiddleware[]]): this

	public useMiddlewares(
		...middlewaresAndPath: [string | NoInputMiddleware, ...(string | NoInputMiddleware)[]]
	): this {
		const possiblyPath = middlewaresAndPath[0]
		const path = typeof possiblyPath === 'string' ? possiblyPath : null

		const middlewares = (
			path === null
				? middlewaresAndPath
				: middlewaresAndPath.filter((_, index) => index !== 0)
		) as BaseMiddleware[]

		middlewares.forEach(middleware => {
			const handler = (request: Request, response: Response, next: NextFunction) => {
				const newRequest = new ExpressRequest(request)
				const newResponse = new ExpressResponse(response)

				middleware
					.index({}, newRequest, newResponse)
					.then(returnValue => {
						if (returnValue === StopHere) return

						next()
					})
					.catch((error: unknown) => {
						Logger.error('Unknown middleware error occured', error)
					})
			}

			if (path === null) this._expressRouter.use(handler)
			else this._expressRouter.use(path, handler)
		})

		return this
	}

	public group(path: string, callback: RouterGroupCallback<Strict>): void
	public group(callback: RouterGroupCallback<Strict>): void
	public group(
		callbackOrPath: RouterGroupCallback<Strict> | string,
		callback?: RouterGroupCallback<Strict>,
	) {
		const router = new ExpressRouter({ strict: this.isStrict })

		if (typeof callbackOrPath === 'string') {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			callback!(router)
		} else {
			callbackOrPath(router)
		}

		if (typeof callbackOrPath === 'string') {
			this.useRouters(callbackOrPath, router)
		} else {
			this.useRouters(router)
		}
	}

	public get<
		Controller extends BaseController<any, ExpressRequest<any, any, any, any>, any>,
		Middlewares extends MiddlewareArray,
	>(
		path: string,
		middlewares: Middlewares & ValidateMiddlewares<Controller, Middlewares>,
		controller: Controller & ValidateControllerWithoutBody<Controller, Middlewares, Strict>,
	) {
		this._expressRouter.get(path, this.handler(middlewares, controller))

		return this
	}

	public head<
		Controller extends BaseController<any, ExpressRequest<any, any, any, any>, any>,
		Middlewares extends MiddlewareArray,
	>(
		path: string,
		middlewares: Middlewares & ValidateMiddlewares<Controller, Middlewares>,
		controller: Controller & ValidateControllerWithoutBody<Controller, Middlewares, Strict>,
	) {
		this._expressRouter.head(path, this.handler(middlewares, controller))

		return this
	}

	public post<
		Controller extends BaseController<any, ExpressRequest<any, any, any, any>, any>,
		Middlewares extends MiddlewareArray,
	>(
		path: string,
		middlewares: Middlewares & ValidateMiddlewares<Controller, Middlewares>,
		controller: Controller & ValidateController<Controller, Middlewares>,
	) {
		this._expressRouter.post(path, this.handler(middlewares, controller))

		return this
	}

	public put<
		Controller extends BaseController<any, ExpressRequest<any, any, any, any>, any>,
		Middlewares extends MiddlewareArray,
	>(
		path: string,
		middlewares: Middlewares & ValidateMiddlewares<Controller, Middlewares>,
		controller: Controller & ValidateController<Controller, Middlewares>,
	) {
		this._expressRouter.put(path, this.handler(middlewares, controller))

		return this
	}

	public patch<
		Controller extends BaseController<any, ExpressRequest<any, any, any, any>, any>,
		Middlewares extends MiddlewareArray,
	>(
		path: string,
		middlewares: Middlewares & ValidateMiddlewares<Controller, Middlewares>,
		controller: Controller & ValidateController<Controller, Middlewares>,
	) {
		this._expressRouter.patch(path, this.handler(middlewares, controller))

		return this
	}

	public delete<
		Controller extends BaseController<any, ExpressRequest<any, any, any, any>, any>,
		Middlewares extends MiddlewareArray,
	>(
		path: string,
		middlewares: Middlewares & ValidateMiddlewares<Controller, Middlewares>,
		controller: Controller & ValidateControllerWithoutBody<Controller, Middlewares, Strict>,
	) {
		this._expressRouter.delete(path, this.handler(middlewares, controller))

		return this
	}

	public options<
		Controller extends BaseController<any, ExpressRequest<any, any, any, any>, any>,
		Middlewares extends MiddlewareArray,
	>(
		path: string,
		middlewares: Middlewares & ValidateMiddlewares<Controller, Middlewares>,
		controller: Controller & ValidateControllerWithoutBody<Controller, Middlewares, Strict>,
	) {
		this._expressRouter.options(path, this.handler(middlewares, controller))

		return this
	}

	public all<
		Controller extends BaseController<any, ExpressRequest<any, any, any, any>, any>,
		Middlewares extends MiddlewareArray,
	>(
		path: string,
		middlewares: Middlewares & ValidateMiddlewares<Controller, Middlewares>,
		controller: Controller & ValidateController<Controller, Middlewares>,
	) {
		this._expressRouter.all(path, this.handler(middlewares, controller))

		return this
	}

	private handler<
		Controller extends BaseController<any, ExpressRequest<any, any, any, any>, any>,
		Middlewares extends BaseMiddleware[],
	>(middlewares: Middlewares, controller: Controller) {
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
				return response.status(422).json({
					data: {},
					errors,
				})

			request.body = parsedBody.data
			request.query = parsedQuery.data
			request.params = parsedParams.data
			request.cookies = parsedCookies.data

			const newRequest = new ExpressRequest(request)
			const newResponse = new ExpressResponse(response)

			let data = {}

			for (const middleware of middlewares) {
				try {
					const output = await middleware.index(data, newRequest, newResponse)

					if (output === StopHere) return

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
