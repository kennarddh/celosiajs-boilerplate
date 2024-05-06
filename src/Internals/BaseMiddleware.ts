import { JSON } from 'Types/JSON'

import BaseRequest from './Providers/Base/BaseRequest'
import BaseResponse from './Providers/Base/BaseResponse'

abstract class BaseMiddleware<
	Request extends BaseRequest<any, any, any, any> = BaseRequest<any, any, any, any>,
	Response extends BaseResponse<any> = BaseResponse<JSON>,
	Input extends Record<string, any> = {},
	Output extends Record<string, any> = {},
> {
	public abstract index(data: Input, request: Request, response: Response): Promise<Output | void>
}

export default BaseMiddleware
