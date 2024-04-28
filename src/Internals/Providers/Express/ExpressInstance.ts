import express, { NextFunction, Request, Response } from 'express'

import { Server } from 'http'

import compression from 'compression'

import cookieParser from 'cookie-parser'

import helmet from 'helmet'

import BaseMiddleware from 'Internals/BaseMiddleware'

import Logger from 'Utils/Logger/Logger'

import BaseInstance, { IListenOptions } from '../Base/BaseInstance'
import ExpressRequest from './ExpressRequest'
import ExpressResponse from './ExpressResponse'
import ExpressRouter from './ExpressRouter'
import ParseJson from './Middlewares/ParseJson'
import ParseUrlencoded from './Middlewares/ParseUrlencoded'

class ExpressInstance extends BaseInstance {
	protected _express: ReturnType<typeof express>
	protected _server: Server | null = null

	/**
	 * Harder migration to other http library if used
	 */
	public get express() {
		return this._express
	}

	public get server() {
		return this._server
	}

	constructor() {
		super()

		this._express = express()

		this._express.disable('x-powered-by')

		this._express.use(compression())
		this._express.use(helmet())

		this._express.use(ParseUrlencoded)
		this._express.use(ParseJson)

		this._express.use(cookieParser())
	}

	public get Router(): new (
		...args: ConstructorParameters<typeof ExpressRouter>
	) => ExpressRouter {
		return ExpressRouter
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

	public useRouters(path: string, ...routers: [ExpressRouter, ...ExpressRouter[]]): this
	public useRouters(...routers: [ExpressRouter, ...ExpressRouter[]]): this
	public useRouters(
		...routersAndPath: [string | ExpressRouter, ...(string | ExpressRouter)[]]
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
	public useMiddlewares(path: string, ...routers: [BaseMiddleware, ...BaseMiddleware[]]): this

	/**
	 * For middlewares without any input or output
	 */
	public useMiddlewares(...routers: [BaseMiddleware, ...BaseMiddleware[]]): this

	public useMiddlewares(
		...middlewaresAndPath: [string | BaseMiddleware, ...(string | BaseMiddleware)[]]
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
