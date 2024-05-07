import { Server } from 'http'

import { BaseRouter, NoInputBaseMiddleware, RouterConstructorOptions, StrictOmit } from 'Internals'

export interface IListenOptions {
	port?: number
	host?: string
	backlog?: number
}

export type InstanceConstructorOptions<Strict extends boolean = true> = {
	strict: Strict
}

abstract class BaseInstance<Strict extends boolean = true> {
	protected _isStrict: Strict

	constructor(options: InstanceConstructorOptions<Strict>) {
		this._isStrict = options.strict
	}

	public get isStrict(): Strict {
		return this._isStrict
	}

	public abstract get server(): Server | null

	public abstract createRouter<StrictRouter extends boolean = true>(
		options: RouterConstructorOptions<StrictRouter>,
	): BaseRouter<StrictRouter>

	public abstract createStrictRouter(
		options: StrictOmit<RouterConstructorOptions<true>, 'strict'>,
	): BaseRouter<true>

	public abstract createNonStrictRouter(
		options: StrictOmit<RouterConstructorOptions<false>, 'strict'>,
	): BaseRouter<false>

	/**
	 * Must be called last after all router is registered
	 */
	public abstract addErrorHandler(): void

	public abstract listen(options: IListenOptions): Promise<void>
	public abstract close(): Promise<void>

	public abstract useRouters(
		path: string,
		...routers: [BaseRouter<Strict>, ...BaseRouter<Strict>[]]
	): this
	public abstract useRouters(...routers: [BaseRouter<Strict>, ...BaseRouter<Strict>[]]): this

	/**
	 * For middlewares without any input or output
	 */
	public abstract useMiddlewares(
		path: string,
		...middlewares: [NoInputBaseMiddleware, ...NoInputBaseMiddleware[]]
	): this

	/**
	 * For middlewares without any input or output
	 */
	public abstract useMiddlewares(
		...middlewares: [NoInputBaseMiddleware, ...NoInputBaseMiddleware[]]
	): this
}

export default BaseInstance
