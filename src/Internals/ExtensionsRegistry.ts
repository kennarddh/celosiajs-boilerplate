/* eslint-disable @typescript-eslint/no-explicit-any */
import {
	DuplicateExtensionError,
	ExpressInstance,
	ExpressRequest,
	ExpressResponse,
	ExpressRouter,
	InvalidExtensionError,
} from './'

export type ExtensionHandler<T, Args extends any[], Return> = (extended: T, ...args: Args) => Return

export type ExpressInstanceExtensionHandler<
	Args extends any[] = any[],
	Return = void,
> = ExtensionHandler<ExpressInstance<boolean>, Args, Return>

export type ExpressRouterExtensionHandler<
	Args extends any[] = any[],
	Return = void,
> = ExtensionHandler<ExpressRouter<boolean>, Args, Return>

export type ExpressRequestExtensionHandler<
	Args extends any[] = any[],
	Return = void,
> = ExtensionHandler<ExpressRequest<any>, Args, Return>

export type ExpressResponseExtensionHandler<
	Args extends any[] = any[],
	Return = void,
> = ExtensionHandler<ExpressResponse<any>, Args, Return>

export type TransformExtensionHandlerToExtensionType<
	Handler extends ExtensionHandler<any, any, any>,
> =
	Handler extends ExtensionHandler<any, infer Args, infer Return>
		? (...args: Args) => Return
		: never

export class ExtensionsRegistryClass {
	private expressInstanceExtensionsHandler = new Map<
		string | symbol,
		ExpressInstanceExtensionHandler
	>()
	private expressRouterExtensionsHandler = new Map<
		string | symbol,
		ExpressRouterExtensionHandler
	>()
	private expressRequestExtensionsHandler = new Map<
		string | symbol,
		ExpressRequestExtensionHandler
	>()
	private expressResponseExtensionsHandler = new Map<
		string | symbol,
		ExpressResponseExtensionHandler
	>()

	registerExpressInstanceExtension(
		key: string | symbol,
		handler: ExpressInstanceExtensionHandler,
	): void {
		if (this.expressInstanceExtensionsHandler.has(key))
			throw new DuplicateExtensionError(
				`Cannot register key "${key.toString()}" because the same key already exists.`,
			)

		this.expressInstanceExtensionsHandler.set(key, handler)
	}

	removeExpressInstanceExtension(key: string | symbol): void {
		if (!this.expressInstanceExtensionsHandler.has(key))
			throw new InvalidExtensionError(
				`Cannot remove key "${key.toString()}" because key doesn't exist.`,
			)

		this.expressInstanceExtensionsHandler.delete(key)
	}

	getExpressInstanceExtension(key: string | symbol): ExpressInstanceExtensionHandler | undefined {
		return this.expressInstanceExtensionsHandler.get(key)
	}

	registerExpressRouterExtension(
		key: string | symbol,
		handler: ExpressRouterExtensionHandler,
	): void {
		if (this.expressRouterExtensionsHandler.has(key))
			throw new DuplicateExtensionError(
				`Cannot register key "${key.toString()}" because the same key already exists.`,
			)

		this.expressRouterExtensionsHandler.set(key, handler)
	}

	removeExpressRouterExtension(key: string | symbol): void {
		if (!this.expressRouterExtensionsHandler.has(key))
			throw new InvalidExtensionError(
				`Cannot remove key "${key.toString()}" because key doesn't exist.`,
			)

		this.expressRouterExtensionsHandler.delete(key)
	}

	getExpressRouterExtension(key: string | symbol): ExpressRouterExtensionHandler | undefined {
		return this.expressRouterExtensionsHandler.get(key)
	}

	registerExpressRequestExtension(
		key: string | symbol,
		handler: ExpressRequestExtensionHandler,
	): void {
		if (this.expressRequestExtensionsHandler.has(key))
			throw new DuplicateExtensionError(
				`Cannot register key "${key.toString()}" because the same key already exists.`,
			)

		this.expressRequestExtensionsHandler.set(key, handler)
	}

	removeExpressRequestExtension(key: string | symbol): void {
		if (!this.expressRequestExtensionsHandler.has(key))
			throw new InvalidExtensionError(
				`Cannot remove key "${key.toString()}" because key doesn't exist.`,
			)

		this.expressRequestExtensionsHandler.delete(key)
	}

	getExpressRequestExtension(key: string | symbol): ExpressRequestExtensionHandler | undefined {
		return this.expressRequestExtensionsHandler.get(key)
	}

	registerExpressResponseExtension(
		key: string | symbol,
		handler: ExpressResponseExtensionHandler,
	): void {
		if (this.expressResponseExtensionsHandler.has(key))
			throw new DuplicateExtensionError(
				`Cannot register key "${key.toString()}" because the same key already exists.`,
			)

		this.expressResponseExtensionsHandler.set(key, handler)
	}

	removeExpressResponseExtension(key: string | symbol): void {
		if (!this.expressResponseExtensionsHandler.has(key))
			throw new InvalidExtensionError(
				`Cannot remove key "${key.toString()}" because key doesn't exist.`,
			)

		this.expressResponseExtensionsHandler.delete(key)
	}

	getExpressResponseExtension(key: string | symbol): ExpressResponseExtensionHandler | undefined {
		return this.expressResponseExtensionsHandler.get(key)
	}
}

const ExtensionsRegistry = new ExtensionsRegistryClass()

export default ExtensionsRegistry
