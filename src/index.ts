import 'dotenv/config'

import cors from 'cors'
import { z } from 'zod'

import {
	BaseController,
	BaseMiddleware,
	ConvertExpressMiddleware,
	EmptyObject,
	ExpressInstance,
	ExpressRequest,
	ExpressResponse,
	ExpressRouter,
	IControllerRequest,
} from 'Internals'

import Logger from 'Utils/Logger/Logger'

export const Port = parseInt(process.env.PORT || '8080', 10)

class RootController extends BaseController {
	public override index(
		_: EmptyObject,
		__: IControllerRequest<RootController>,
		response: ExpressResponse,
	) {
		response.status(200).json({ message: 'Hello world' })
	}
}

class HeadController extends BaseController {
	public override index(
		_: EmptyObject,
		__: IControllerRequest<HeadController>,
		response: ExpressResponse,
	) {
		response.sendStatus(204)
	}
}

class AuthController extends BaseController {
	public override index(
		_: EmptyObject,
		__: IControllerRequest<AuthController>,
		response: ExpressResponse,
	) {
		response.status(200).json({ message: 'Auth' })
	}
}

class AuthUserController extends BaseController {
	public override index(
		_: EmptyObject,
		request: IControllerRequest<AuthUserController>,
		response: ExpressResponse,
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
		_: EmptyObject,
		__: IControllerRequest<NotFoundController>,
		response: ExpressResponse,
	) {
		response.status(404).json({ message: 'Not Found' })
	}
}

class PostController extends BaseController {
	public override index(
		_: EmptyObject,
		request: IControllerRequest<PostController>,
		response: ExpressResponse,
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
	public override async index(_: EmptyObject, __: ExpressRequest, response: ExpressResponse) {
		response.header('Request-Left', 10)
	}
}

class AuthMiddleware extends BaseMiddleware {
	public override async index(_: EmptyObject, __: ExpressRequest, response: ExpressResponse) {
		response.header('Auth', 1)
	}
}

class Auth2Middleware extends BaseMiddleware {
	public override async index(_: EmptyObject, __: ExpressRequest, response: ExpressResponse) {
		response.header('Auth2', 1)
	}
}

class VerifyMiddleware extends BaseMiddleware {
	public override async index(
		_: EmptyObject,
		request: ExpressRequest<{ id: string }>,
		response: ExpressResponse,
	): Promise<{ username: string }> {
		response.header('Auth2', 1)

		return { username: request.body.id }
	}
}

class Verify2Middleware extends BaseMiddleware {
	public override async index(
		data: { username: string },
		request: ExpressRequest<{ id: string }>,
		response: ExpressResponse,
	): Promise<{ email: string }> {
		response.header('Auth2', 1)

		return {
			email: `${request.body.id}+${data.username}@example.com`,
		}
	}
}

class Verify3Middleware extends BaseMiddleware {
	public override async index(
		_: EmptyObject,
		__: ExpressRequest<{ id: string }>,
		response: ExpressResponse,
	): Promise<{ id: number }> {
		response.header('Auth2', 1)

		return {
			id: Math.random(),
		}
	}
}

class AuthorizedController extends BaseController {
	public override index(
		data: { username: string; email: string },
		request: IControllerRequest<AuthorizedController>,
		response: ExpressResponse<{ message: string }>,
	) {
		response
			.status(200)
			.json({ message: `User ID: ${request.body.id}, Username: ${data.username}` })
	}

	public override get body() {
		return z.object({
			id: z.string(),
		})
	}
}

export const Instance = new ExpressInstance({ strict: true })

Instance.useMiddlewares(new (ConvertExpressMiddleware(cors()))())

const rootRouter = new ExpressRouter({ strict: true })

Instance.useMiddlewares(new RateLimitMiddleware())

rootRouter.post(
	'/authorized',
	[new VerifyMiddleware(), new Verify2Middleware(), new Verify3Middleware()],
	new AuthorizedController(),
)

// rootRouter.get(
// 	'/authorized',
// 	[new VerifyMiddleware(), new Verify2Middleware()],
// 	new AuthorizedController(),
// )

rootRouter.head('/head', [], new HeadController())
rootRouter.get('/', [], new RootController())
rootRouter.post('/', [], new PostController())

const authRouter = new ExpressRouter({ strict: true })

authRouter.useMiddlewares('/1', new AuthMiddleware())

authRouter.get('/1', [new Auth2Middleware()], new AuthController())
authRouter.get('/2', [new Auth2Middleware()], new AuthController())
authRouter.get('/user/:id', [new Auth2Middleware()], new AuthUserController())

rootRouter.useRouters('/auth', authRouter)

Instance.useRouters(rootRouter)

rootRouter.all('*', [], new NotFoundController())

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
