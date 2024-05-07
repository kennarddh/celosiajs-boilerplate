import express, { NextFunction, Request, Response } from 'express'

import { Server } from 'http'

import compression from 'compression'

import cookieParser from 'cookie-parser'

import helmet from 'helmet'

import {
	BaseInstance,
	BaseMiddleware,
	ExpressRequest,
	ExpressResponse,
	ExpressRouter,
	IListenOptions,
	InstanceConstructorOptions,
	NoInputBaseMiddleware,
	RouterConstructorOptions,
	StrictOmit,
} from 'Internals'

import Logger from 'Utils/Logger/Logger'

import ParseJson from './Middlewares/ParseJson'
import ParseUrlencoded from './Middlewares/ParseUrlencoded'

class ExpressInstance<Strict extends boolean> extends BaseInstance<Strict> {
	protected _express: ReturnType<typeof express>
	protected _server: Server | null = null

	constructor(options: InstanceConstructorOptions<Strict>) {
		super(options)

		this._express = express()

		this._express.disable('x-powered-by')

		this._express.use(compression())
		this._express.use(helmet())

		this._express.use(ParseUrlencoded)
		this._express.use(ParseJson)

		this._express.use(cookieParser())
	}

	/**
	 * Harder migration to other http library if used
	 */
	public get express() {
		return this._express
	}

	public get server() {
		return this._server
	}

	public createRouter<StrictRouter extends boolean = true>(
		options: RouterConstructorOptions<StrictRouter>,
	): ExpressRouter<StrictRouter> {
		return new ExpressRouter<StrictRouter>(options)
	}

	public createStrictRouter(
		options: StrictOmit<RouterConstructorOptions<true>, 'strict'>,
	): ExpressRouter<true> {
		return new ExpressRouter<true>({ ...options, strict: true })
	}

	public createNonStrictRouter(
		options: StrictOmit<RouterConstructorOptions<false>, 'strict'>,
	): ExpressRouter<false> {
		return new ExpressRouter<false>({ ...options, strict: false })
	}

	/**
	 * Must be called last after all router is registered
	 *
	 * Doesn't work until Express 5 because Express 4.x won't catch uncaught exception in promise.
	 */
	public addErrorHandler() {
		this._express.use(
			(error: Error, _: Request, response: Response, __: NextFunction): void => {
				Logger.error('Error occured.', error)

				response.status(500).json({ errors: ['Internal Server Error'], data: {} })
			},
		)
	}

	public listen(options: IListenOptions): Promise<void> {
		if (this._server !== null) throw new Error('Server already running')

		return new Promise(resolve => {
			// https://stackoverflow.com/a/69324331/14813577
			this._server = this._express.listen(
				options.port ?? 0,
				options.host ?? '127.0.0.1',
				options.backlog ?? 511,
				() => resolve(),
			)
		})
	}

	public close(): Promise<void> {
		if (this._server === null) throw new Error('Server is not running')

		return new Promise((resolve, reject) => {
			this._server?.close(error => {
				if (error) reject(error)
				else resolve()
			})
		})
	}

	public useRouters(
		path: string,
		...routers: [ExpressRouter<Strict>, ...ExpressRouter<Strict>[]]
	): this
	public useRouters(...routers: [ExpressRouter<Strict>, ...ExpressRouter<Strict>[]]): this
	public useRouters(
		...routersAndPath: [string | ExpressRouter<Strict>, ...(string | ExpressRouter<Strict>)[]]
	): this {
		const possiblyPath = routersAndPath[0]
		const path = typeof possiblyPath === 'string' ? possiblyPath : null

		const routers = (
			path === null ? routersAndPath : routersAndPath.filter((_, index) => index !== 0)
		) as ExpressRouter[]

		routers.forEach(router => {
			if (path === null) this.express.use(router.expressRouter)
			else this.express.use(path, router.expressRouter)
		})

		return this
	}

	/**
	 * For middlewares without any input or output
	 */
	public useMiddlewares(
		path: string,
		...routers: [NoInputBaseMiddleware, ...NoInputBaseMiddleware[]]
	): this

	/**
	 * For middlewares without any input or output
	 */
	public useMiddlewares(...routers: [NoInputBaseMiddleware, ...NoInputBaseMiddleware[]]): this

	public useMiddlewares(
		...middlewaresAndPath: [
			string | NoInputBaseMiddleware,
			...(string | NoInputBaseMiddleware)[],
		]
	): this {
		const possiblyPath = middlewaresAndPath[0]
		const path = typeof possiblyPath === 'string' ? possiblyPath : null

		const middlewares = (
			path === null
				? middlewaresAndPath
				: middlewaresAndPath.filter((_, index) => index !== 0)
		) as BaseMiddleware[]

		middlewares.forEach(middleware => {
			const handler = (request: Request, response: Response, next: NextFunction) => {
				const newRequest = new ExpressRequest(request)
				const newResponse = new ExpressResponse(response)

				middleware.index({}, newRequest, newResponse).then(() => {
					next()
				})
			}

			if (path === null) this.express.use(handler)
			else this.express.use(path, handler)
		})

		return this
	}
}

export default ExpressInstance
