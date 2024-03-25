
import  { IControllerResponse, IRequest } from './BaseController'

abstract class BaseMiddleware<
	Request extends IRequest<any> = IRequest,
	Input extends Record<string, any> = {},
	Output extends Record<string, any> = {},
> {
	public abstract index(data: Input, request: Request, response: IControllerResponse): Promise<Output>
}

export default BaseMiddleware
