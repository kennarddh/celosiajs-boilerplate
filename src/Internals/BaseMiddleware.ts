import { JSON } from 'Types/JSON'

import BaseRequest from './Providers/Base/BaseRequest'
import BaseResponse from './Providers/Base/BaseResponse'

type EmptyObject = Record<string, never>

abstract class BaseMiddleware<
	Request extends BaseRequest<any, any, any, any> = BaseRequest,
	Response extends BaseResponse<any> = BaseResponse<JSON>,
	Input extends Record<string, any> = EmptyObject,
	Output extends Record<string, any> = EmptyObject,
> {
	public abstract index(data: Input, request: Request, response: Response): Promise<Output | void>
}

export default BaseMiddleware
