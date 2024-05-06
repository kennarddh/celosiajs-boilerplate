import { Server } from 'http'

import { BaseRouter, NoInputMiddleware } from 'Internals'

export interface IListenOptions {
	port?: number
	host?: string
	backlog?: number
}

abstract class BaseInstance {
	public abstract get server(): Server | null

	public abstract get Router(): new (
		...args: ConstructorParameters<typeof BaseRouter>
	) => BaseRouter

	/**
	 * Must be called last after all router is registered
	 */
	public abstract addErrorHandler(): void

	public abstract listen(options: IListenOptions): Promise<void>
	public abstract close(): Promise<void>

	public abstract useRouters(path: string, ...routers: [BaseRouter, ...BaseRouter[]]): this
	public abstract useRouters(...routers: [BaseRouter, ...BaseRouter[]]): this

	/**
	 * For middlewares without any input or output
	 */
	public abstract useMiddlewares(
		path: string,
		...middlewares: [NoInputMiddleware, ...NoInputMiddleware[]]
	): this

	/**
	 * For middlewares without any input or output
	 */
	public abstract useMiddlewares(
		...middlewares: [NoInputMiddleware, ...NoInputMiddleware[]]
	): this
}

export default BaseInstance
