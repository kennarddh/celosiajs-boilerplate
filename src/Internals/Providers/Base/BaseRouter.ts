import {
	BaseController,
	BaseMiddlewareArray,
	NoInputBaseMiddleware,
	ValidateController,
	ValidateControllerWithoutBody,
	ValidateMiddlewares,
} from 'Internals'

export interface ParsingInput {
	body: unknown
	query: unknown
	params: unknown
	cookies: unknown
}

abstract class BaseRouter<Strict extends boolean = true> {
	public abstract useRouters(path: string, ...routers: [BaseRouter, ...BaseRouter[]]): this
	public abstract useRouters(...routers: [BaseRouter, ...BaseRouter[]]): this

	/**
	 * For middlewares without any input or output
	 */
	public abstract useMiddlewares(
		path: string,
		...middlewares: [NoInputBaseMiddleware, ...NoInputBaseMiddleware[]]
	): this

	/**
	 * For middlewares without any input or output
	 */
	public abstract useMiddlewares(
		...middlewares: [NoInputBaseMiddleware, ...NoInputBaseMiddleware[]]
	): this

	public abstract get<
		Controller extends BaseController<any, any, any>,
		Middlewares extends BaseMiddlewareArray,
	>(
		path: string,
		middlewares: Middlewares & ValidateMiddlewares<Controller, Middlewares>,
		controller: Controller & ValidateControllerWithoutBody<Controller, Middlewares, Strict>,
	): this

	public abstract head<
		Controller extends BaseController<any, any, any>,
		Middlewares extends BaseMiddlewareArray,
	>(
		path: string,
		middlewares: Middlewares & ValidateMiddlewares<Controller, Middlewares>,
		controller: Controller & ValidateControllerWithoutBody<Controller, Middlewares, Strict>,
	): this

	public abstract post<
		Controller extends BaseController<any, any, any>,
		Middlewares extends BaseMiddlewareArray,
	>(
		path: string,
		middlewares: Middlewares & ValidateMiddlewares<Controller, Middlewares>,
		controller: Controller & ValidateController<Controller, Middlewares>,
	): this

	public abstract put<
		Controller extends BaseController<any, any, any>,
		Middlewares extends BaseMiddlewareArray,
	>(
		path: string,
		middlewares: Middlewares & ValidateMiddlewares<Controller, Middlewares>,
		controller: Controller & ValidateController<Controller, Middlewares>,
	): this

	public abstract patch<
		Controller extends BaseController<any, any, any>,
		Middlewares extends BaseMiddlewareArray,
	>(
		path: string,
		middlewares: Middlewares & ValidateMiddlewares<Controller, Middlewares>,
		controller: Controller & ValidateController<Controller, Middlewares>,
	): this

	public abstract delete<
		Controller extends BaseController<any, any, any>,
		Middlewares extends BaseMiddlewareArray,
	>(
		path: string,
		middlewares: Middlewares & ValidateMiddlewares<Controller, Middlewares>,
		controller: Controller & ValidateControllerWithoutBody<Controller, Middlewares, Strict>,
	): this

	public abstract options<
		Controller extends BaseController<any, any, any>,
		Middlewares extends BaseMiddlewareArray,
	>(
		path: string,
		middlewares: Middlewares & ValidateMiddlewares<Controller, Middlewares>,
		controller: Controller & ValidateControllerWithoutBody<Controller, Middlewares, Strict>,
	): this

	public abstract all<
		Controller extends BaseController<any, any, any>,
		Middlewares extends BaseMiddlewareArray,
	>(
		path: string,
		middlewares: Middlewares & ValidateMiddlewares<Controller, Middlewares>,
		controller: Controller & ValidateController<Controller, Middlewares>,
	): this

	async parseData(controller: BaseController<any, any, any>, parsingData: ParsingInput) {
		return {
			body: await controller.body.safeParseAsync(parsingData.body),
			query: await controller.query.safeParseAsync(parsingData.query),
			params: await controller.params.safeParseAsync(parsingData.params),
			cookies: await controller.cookies.safeParseAsync(parsingData.cookies),
		}
	}
}

export default BaseRouter
