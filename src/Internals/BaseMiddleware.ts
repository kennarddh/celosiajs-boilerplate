/* eslint-disable @typescript-eslint/no-explicit-any */
import { EmptyObject, ExpressRequest, ExpressResponse, StopHere } from 'Internals'

abstract class BaseMiddleware<
	Request extends ExpressRequest<any, any, any, any> = ExpressRequest<any, any, any, any>,
	Response extends ExpressResponse<any> = ExpressResponse<any>,
	Input extends Record<string, any> = EmptyObject,
	Output extends Record<string, any> | EmptyObject = EmptyObject,
> {
	public abstract index(
		data: Input,
		request: Request,
		response: Response,
	): Promise<Output | typeof StopHere | undefined> | Promise<void>
}

export default BaseMiddleware
