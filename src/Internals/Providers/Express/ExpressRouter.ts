import express, { NextFunction, Request, Response } from 'express'

import {
	BaseController,
	BaseMiddleware,
	BaseRouter,
	ExpressRequest,
	ExpressResponse,
	NoInputBaseMiddleware,
	ValidateController,
	ValidateMiddlewares,
} from 'Internals'

export type ExpressMiddlewareArray = BaseMiddleware<
	ExpressRequest<any, any, any, any>,
	any,
	any,
	any
>[]

class ExpressRouter extends BaseRouter {
	private _expressRouter = express.Router()

	public get expressRouter() {
		return this._expressRouter
	}

	public useRouters(path: string, ...routers: [ExpressRouter, ...ExpressRouter[]]): this
	public useRouters(...routers: [ExpressRouter, ...ExpressRouter[]]): this
	public useRouters(
		...routersAndPath: [string | ExpressRouter, ...(string | ExpressRouter)[]]
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
		...routers: [NoInputBaseMiddleware, ...NoInputBaseMiddleware[]]
	): this

	/**
	 * For middlewares without any input or output
	 */
	public useMiddlewares(...routers: [NoInputBaseMiddleware, ...NoInputBaseMiddleware[]]): this

	public useMiddlewares(
		...middlewaresAndPath: [
			string | NoInputBaseMiddleware,
			...(string | NoInputBaseMiddleware)[],
		]
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

				middleware.index({}, newRequest, newResponse).then(() => {
					next()
				})
			}

			if (path === null) this._expressRouter.use(handler)
			else this._expressRouter.use(path, handler)
		})

		return this
	}

	public get<
		Controller extends BaseController<any, ExpressRequest<any, any, any, any>, any>,
		Middlewares extends ExpressMiddlewareArray,
	>(
		path: string,
		middlewares: Middlewares & ValidateMiddlewares<Controller, Middlewares>,
		controller: Controller &
			ValidateController<
				Controller,
				Middlewares,
				ExpressRequest<any, any, any, any>,
				ExpressResponse<any>
			>,
	) {
		this._expressRouter.get(path, this.handler(middlewares, controller))

		return this
	}

	public post<
		Controller extends BaseController<any, ExpressRequest<any, any, any, any>, any>,
		Middlewares extends ExpressMiddlewareArray,
	>(
		path: string,
		middlewares: Middlewares & ValidateMiddlewares<Controller, Middlewares>,
		controller: Controller &
			ValidateController<
				Controller,
				Middlewares,
				ExpressRequest<any, any, any, any>,
				ExpressResponse<any>
			>,
	) {
		this._expressRouter.post(path, this.handler(middlewares, controller))

		return this
	}

	public put<
		Controller extends BaseController<any, ExpressRequest<any, any, any, any>, any>,
		Middlewares extends ExpressMiddlewareArray,
	>(
		path: string,
		middlewares: Middlewares & ValidateMiddlewares<Controller, Middlewares>,
		controller: Controller &
			ValidateController<
				Controller,
				Middlewares,
				ExpressRequest<any, any, any, any>,
				ExpressResponse<any>
			>,
	) {
		this._expressRouter.put(path, this.handler(middlewares, controller))

		return this
	}

	public patch<
		Controller extends BaseController<any, ExpressRequest<any, any, any, any>, any>,
		Middlewares extends ExpressMiddlewareArray,
	>(
		path: string,
		middlewares: Middlewares & ValidateMiddlewares<Controller, Middlewares>,
		controller: Controller &
			ValidateController<
				Controller,
				Middlewares,
				ExpressRequest<any, any, any, any>,
				ExpressResponse<any>
			>,
	) {
		this._expressRouter.patch(path, this.handler(middlewares, controller))

		return this
	}

	public delete<
		Controller extends BaseController<any, ExpressRequest<any, any, any, any>, any>,
		Middlewares extends ExpressMiddlewareArray,
	>(
		path: string,
		middlewares: Middlewares & ValidateMiddlewares<Controller, Middlewares>,
		controller: Controller &
			ValidateController<
				Controller,
				Middlewares,
				ExpressRequest<any, any, any, any>,
				ExpressResponse<any>
			>,
	) {
		this._expressRouter.delete(path, this.handler(middlewares, controller))

		return this
	}

	public options<
		Controller extends BaseController<any, ExpressRequest<any, any, any, any>, any>,
		Middlewares extends ExpressMiddlewareArray,
	>(
		path: string,
		middlewares: Middlewares & ValidateMiddlewares<Controller, Middlewares>,
		controller: Controller &
			ValidateController<
				Controller,
				Middlewares,
				ExpressRequest<any, any, any, any>,
				ExpressResponse<any>
			>,
	) {
		this._expressRouter.options(path, this.handler(middlewares, controller))

		return this
	}

	public all<
		Controller extends BaseController<any, ExpressRequest<any, any, any, any>, any>,
		Middlewares extends ExpressMiddlewareArray,
	>(
		path: string,
		middlewares: Middlewares & ValidateMiddlewares<Controller, Middlewares>,
		controller: Controller &
			ValidateController<
				Controller,
				Middlewares,
				ExpressRequest<any, any, any, any>,
				ExpressResponse<any>
			>,
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
