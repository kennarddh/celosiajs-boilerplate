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

class AuthController extends BaseController {
	public override index(
		data: EmptyObject,
		request: IControllerRequest<typeof this>,
		response: BaseResponse<JSON>,
	) {
		response.status(200).json({ message: 'Auth' })
	}
}

class AuthUserController extends BaseController {
	public override index(
		data: EmptyObject,
		request: IControllerRequest<AuthUserController>,
		response: BaseResponse<JSON>,
	) {
		response.status(200).json({ message: `User ID: ${request.params.id}` })
	}

	public override get params() {
		return z.object({
			id: z.string(),
		})
	}
}

class NotFoundController extends BaseController {
	public override index(
		data: EmptyObject,
		request: IControllerRequest<typeof this>,
		response: BaseResponse<JSON>,
	) {
		response.status(404).json({ message: 'Not Found' })
	}
}

class PostController extends BaseController {
	public override index(
		data: {},
		request: IControllerRequest<PostController>,
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

class AuthMiddleware extends BaseMiddleware {
	public override async index(data: {}, request: BaseRequest, response: BaseResponse<JSON>) {
		response.header('Auth', 1)
	}
}

class Auth2Middleware extends BaseMiddleware {
	public override async index(data: {}, request: BaseRequest, response: BaseResponse<JSON>) {
		response.header('Auth2', 1)
	}
}

class VerifyMiddleware extends BaseMiddleware {
	public override async index(
		data: {},
		request: BaseRequest<{ id: string }>,
		response: BaseResponse<JSON>,
	): Promise<{ username: string }> {
		response.header('Auth2', 1)

		return { username: `${request.body.id}` }
	}
}

class AuthorizedController extends BaseController {
	public override index(
		data: { username: string },
		request: IControllerRequest<AuthorizedController>,
		response: BaseResponse<JSON>,
	) {
		response.status(200).json({ message: `User ID: ${request.body.id}` })
	}

	public override get body() {
		return z.object({
			id: z.string(),
		})
	}
}

Instance.useMiddlewares(new RateLimitMiddleware())

rootRouter.post('/', [new VerifyMiddleware()], new AuthorizedController())

rootRouter.get('/', [], new RootController())
rootRouter.post('/', [], new PostController())

rootRouter.all('*', [], new NotFoundController())

const authRouter = new Instance.Router()

authRouter.useMiddlewares('/1', new AuthMiddleware())

authRouter.get('/1', [new Auth2Middleware()], new AuthController())
authRouter.get('/2', [new Auth2Middleware()], new AuthController())
authRouter.get('/user/:id', [new Auth2Middleware()], new AuthUserController())

rootRouter.useRouters('/auth', authRouter)

Instance.useRouters(rootRouter)

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
