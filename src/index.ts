import 'dotenv/config'
import { z } from 'zod'

import BaseController from 'Internals/BaseController'
import BaseMiddleware from 'Internals/BaseMiddleware'
import BaseRequest from 'Internals/Providers/Base/BaseRequest'
import BaseResponse from 'Internals/Providers/Base/BaseResponse'
import ExpressInstance from 'Internals/Providers/Express/ExpressInstance'
import { EmptyObject, IControllerRequest } from 'Internals/Types'

import { JSON } from 'Types/JSON'

import Logger from 'Utils/Logger/Logger'

export const Port = parseInt(process.env.PORT || '8080', 10)

export const Instance = new ExpressInstance()

const rootRouter = new Instance.Router()

class RootController extends BaseController {
	public override index(
		data: EmptyObject,
		request: IControllerRequest<typeof this>,
		response: BaseResponse<JSON>,
	) {
		response.status(200).json({ message: 'Hello world' })
	}
}

class PostController extends BaseController {
	public override index(
		data: {},
		request: IControllerRequest<typeof this>,
		response: BaseResponse,
	) {
		response.status(200).json({
			message: `Hello ${request.body.name}${request.body.lastName ? ` ${request.body.lastName}` : ''}`,
		})
	}

	public override get body() {
		return z.object({
			name: z.string().min(3).max(10),
			lastName: z.string().min(3).max(20).optional(),
		})
	}
}

class RateLimitMiddleware extends BaseMiddleware {
	public override async index(data: {}, request: BaseRequest, response: BaseResponse<JSON>) {
		response.header('Request-Left', 10)
	}
}

Instance.useMiddlewares(new RateLimitMiddleware())

rootRouter.get('/', [], new RootController())
rootRouter.post('/', [], new PostController())

Instance.useRouter(rootRouter)

Instance.addErrorHandler()

await Instance.listen({ port: Port })

Logger.info(`Server running`, {
	port: Port,
	pid: process.pid,
	env: process.env.NODE_ENV,
})
// Graceful Shutdown
// process.on('SIGTERM', OnShutdown('SIGTERM'))
// process.on('SIGINT', OnShutdown('SIGINT'))
