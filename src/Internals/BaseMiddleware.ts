import { ExpressRequest, ExpressResponse } from 'Internals'

abstract class BaseMiddleware<
	Request extends ExpressRequest<any, any, any, any> = ExpressRequest<any, any, any, any>,
	Response extends ExpressResponse<any> = ExpressResponse<any>,
	Input extends Record<string, any> = {},
	Output extends Record<string, any> = {},
> {
	public abstract index(data: Input, request: Request, response: Response): Promise<Output | void>
}

export default BaseMiddleware
