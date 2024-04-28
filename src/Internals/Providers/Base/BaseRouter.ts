import BaseMiddleware from 'Internals/BaseMiddleware'

import BaseController from '../../BaseController'
import { EmptyObject, MiddlewareArray, ValidateController, ValidateMiddlewares } from '../../Types'
import BaseRequest from './BaseRequest'
import BaseResponse from './BaseResponse'

export interface ParsingInput {
	body: unknown
	query: unknown
	params: unknown
	cookies: unknown
}

abstract class BaseRouter {
	public abstract useRouters(...routers: BaseRouter[]): this

	/**
	 * For middlewares without any input or output
	 */
	public abstract useMiddlewares(
		...middlewares: BaseMiddleware<
			BaseRequest<EmptyObject, EmptyObject, EmptyObject, EmptyObject>,
			BaseResponse,
			EmptyObject
		>[]
	): this

	public abstract get<
		Controller extends BaseController<any>,
		Middlewares extends MiddlewareArray,
	>(
		path: string,
		middlewares: Middlewares & ValidateMiddlewares<Controller, Middlewares>,
		controller: Controller & ValidateController<Controller, Middlewares>,
	): this

	public abstract post<
		Controller extends BaseController<any>,
		Middlewares extends MiddlewareArray,
	>(
		path: string,
		middlewares: Middlewares & ValidateMiddlewares<Controller, Middlewares>,
		controller: Controller & ValidateController<Controller, Middlewares>,
	): this

	public abstract put<
		Controller extends BaseController<any>,
		Middlewares extends MiddlewareArray,
	>(
		path: string,
		middlewares: Middlewares & ValidateMiddlewares<Controller, Middlewares>,
		controller: Controller & ValidateController<Controller, Middlewares>,
	): this

	public abstract patch<
		Controller extends BaseController<any>,
		Middlewares extends MiddlewareArray,
	>(
		path: string,
		middlewares: Middlewares & ValidateMiddlewares<Controller, Middlewares>,
		controller: Controller & ValidateController<Controller, Middlewares>,
	): this

	public abstract delete<
		Controller extends BaseController<any>,
		Middlewares extends MiddlewareArray,
	>(
		path: string,
		middlewares: Middlewares & ValidateMiddlewares<Controller, Middlewares>,
		controller: Controller & ValidateController<Controller, Middlewares>,
	): this

	public abstract options<
		Controller extends BaseController<any>,
		Middlewares extends MiddlewareArray,
	>(
		path: string,
		middlewares: Middlewares & ValidateMiddlewares<Controller, Middlewares>,
		controller: Controller & ValidateController<Controller, Middlewares>,
	): this

	public abstract all<
		Controller extends BaseController<any>,
		Middlewares extends MiddlewareArray,
	>(
		path: string,
		middlewares: Middlewares & ValidateMiddlewares<Controller, Middlewares>,
		controller: Controller & ValidateController<Controller, Middlewares>,
	): this

	async parseData(controller: BaseController<any>, parsingData: ParsingInput) {
		return {
			body: await controller.body.safeParseAsync(parsingData.body),
			query: await controller.query.safeParseAsync(parsingData.query),
			params: await controller.params.safeParseAsync(parsingData.params),
			cookies: await controller.cookies.safeParseAsync(parsingData.cookies),
		}
	}
}

export default BaseRouter
