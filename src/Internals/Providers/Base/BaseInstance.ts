import { Server } from 'http'

import BaseRouter from './BaseRouter'

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

	public abstract listen(options: IListenOptions): Promise<void>
	public abstract close(): Promise<void>
}

export default BaseInstance
