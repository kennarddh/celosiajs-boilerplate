import express from 'express'

import { Server } from 'http'

import compression from 'compression'

import cookieParser from 'cookie-parser'

import helmet from 'helmet'

import BaseInstance, { IListenOptions } from '../Base/BaseInstance'
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
}

export default ExpressInstance
