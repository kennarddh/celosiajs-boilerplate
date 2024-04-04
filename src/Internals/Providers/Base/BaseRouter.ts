import BaseController from '../../BaseController'
import { MiddlewareArray, ValidateController, ValidateMiddlewares } from '../../Types'

export interface ParsingInput {
	body: unknown
	query: unknown
	params: unknown
	cookies: unknown
}

abstract class BaseRouter {
	public abstract get<Controller extends BaseController<any>, Middlewares extends MiddlewareArray>(
		path: string,
		middlewares: Middlewares & ValidateMiddlewares<Controller, Middlewares>,
		controller: Controller & ValidateController<Controller, Middlewares>,
	): this

	public abstract post<Controller extends BaseController<any>, Middlewares extends MiddlewareArray>(
		path: string,
		middlewares: Middlewares & ValidateMiddlewares<Controller, Middlewares>,
		controller: Controller & ValidateController<Controller, Middlewares>,
	): this

	public abstract put<Controller extends BaseController<any>, Middlewares extends MiddlewareArray>(
		path: string,
		middlewares: Middlewares & ValidateMiddlewares<Controller, Middlewares>,
		controller: Controller & ValidateController<Controller, Middlewares>,
	): this

	public abstract patch<Controller extends BaseController<any>, Middlewares extends MiddlewareArray>(
		path: string,
		middlewares: Middlewares & ValidateMiddlewares<Controller, Middlewares>,
		controller: Controller & ValidateController<Controller, Middlewares>,
	): this

	public abstract delete<Controller extends BaseController<any>, Middlewares extends MiddlewareArray>(
		path: string,
		middlewares: Middlewares & ValidateMiddlewares<Controller, Middlewares>,
		controller: Controller & ValidateController<Controller, Middlewares>,
	): this

	public abstract options<Controller extends BaseController<any>, Middlewares extends MiddlewareArray>(
		path: string,
		middlewares: Middlewares & ValidateMiddlewares<Controller, Middlewares>,
		controller: Controller & ValidateController<Controller, Middlewares>,
	): this

	public abstract all<Controller extends BaseController<any>, Middlewares extends MiddlewareArray>(
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
