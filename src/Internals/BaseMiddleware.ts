import { BaseRequest, BaseResponse } from 'Internals'

abstract class BaseMiddleware<
	Request extends BaseRequest<any, any, any, any> = BaseRequest<any, any, any, any>,
	Response extends BaseResponse<any> = BaseResponse<any>,
	Input extends Record<string, any> = {},
	Output extends Record<string, any> = {},
> {
	public abstract index(data: Input, request: Request, response: Response): Promise<Output | void>
}

export default BaseMiddleware
