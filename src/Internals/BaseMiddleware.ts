import { IControllerResponse, IRequest } from './BaseController'

type EmptyObject = Record<string, never>

abstract class BaseMiddleware<
	Request extends IRequest<any, any, any, any> = IRequest,
	Input extends Record<string, any> = EmptyObject,
	Output extends Record<string, any> = EmptyObject,
> {
	public abstract index(
		data: Input,
		request: Request,
		response: IControllerResponse,
	): Promise<Output>
}

export default BaseMiddleware
