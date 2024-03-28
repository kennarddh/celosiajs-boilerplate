import Request from "./Providers/Base/Request"
import { IControllerResponse } from "./Types"

type EmptyObject = Record<string, never>

abstract class BaseMiddleware<
	Req extends Request<any, any, any, any> = Request,
	Input extends Record<string, any> = EmptyObject,
	Output extends Record<string, any> = EmptyObject,
> {
	public abstract index(
		data: Input,
		request: Req,
		response: IControllerResponse,
	): Promise<Output>
}

export default BaseMiddleware
