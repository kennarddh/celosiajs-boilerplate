import { z } from 'zod'

import {
	BaseController,
	BaseMiddleware,
	BaseRequest,
	BaseResponse,
	IControllerBaseRequest,
} from 'Internals'

// https://github.com/sindresorhus/type-fest/blob/main/source/empty-object.d.ts
declare const emptyObjectSymbol: unique symbol

export type EmptyObject = { [emptyObjectSymbol]?: never }

export type StrictOmit<T, K extends keyof T> = {} extends Omit<T, K> ? EmptyObject : Omit<T, K>

export type BaseMiddlewareArray = BaseMiddleware<any, any, any, any>[]

export type NoInputBaseMiddleware = BaseMiddleware<
	BaseRequest<any, any, any, any>,
	BaseResponse<any>,
	EmptyObject
>

export type IControllerResponse<Controller extends BaseController<any, any, any>> =
	Controller extends BaseController<any, any, infer Response> ? Response : never

/**
 * I don't know how that "& 1" fixes the problem but it does.
 *
 * The problem is when a middleware require a body in request but the controller doesn't provide it.
 */
export type ValidateMiddlewares<
	Controller extends BaseController<any, any, any>,
	T extends BaseMiddlewareArray,
	Input extends Record<string, any> = EmptyObject,
	Results extends BaseMiddlewareArray = [],
> = T extends [
	BaseMiddleware<infer Request, infer Response, infer RequiredInput, infer Output>,
	...infer Tail extends BaseMiddlewareArray,
]
	? IControllerBaseRequest<Controller> extends Request
		? Response extends IControllerResponse<Controller>
			? RequiredInput extends Input
				? ValidateMiddlewares<Controller, Tail, Input & Output, [...Results, T[0]]>
				: ValidateMiddlewares<
						Controller,
						Tail,
						Input,
						[
							...Results,
							BaseMiddleware<
								IControllerBaseRequest<Controller> & 1,
								IControllerResponse<Controller>,
								Input,
								Output
							>,
						]
					>
			: ValidateMiddlewares<
					Controller,
					Tail,
					Input,
					[
						...Results,
						BaseMiddleware<
							IControllerBaseRequest<Controller> & 1,
							IControllerResponse<Controller>,
							Input,
							Output
						>,
					]
				>
		: ValidateMiddlewares<
				Controller,
				Tail,
				Input,
				[
					...Results,
					BaseMiddleware<
						IControllerBaseRequest<Controller> & 1,
						IControllerResponse<Controller>,
						Input,
						Output
					>,
				]
			>
	: Results

export type MergeMiddlewaresOutput<
	T extends BaseMiddlewareArray,
	Input extends Record<string, any> = {},
> = T extends [
	BaseMiddleware<any, any, any, infer Output>,
	...infer Tail extends BaseMiddlewareArray,
]
	? MergeMiddlewaresOutput<Tail, Output & Input>
	: Input

export type ValidateController<
	Controller extends BaseController<any, any, any>,
	Middlewares extends BaseMiddlewareArray | [],
	RequiredRequest extends BaseRequest<any, any, any, any> = BaseRequest<any, any, any, any>,
	RequiredResponse extends BaseResponse<any> = BaseResponse<any>,
> =
	Controller extends BaseController<infer Data, infer Request, infer Response>
		? RequiredRequest extends Request
			? RequiredResponse extends Response
				? MergeMiddlewaresOutput<Middlewares> extends Data
					? Controller
					: never
				: never
			: never
		: never

export type ValidateControllerWithoutBody<
	Controller extends BaseController<any, any, any>,
	Middlewares extends BaseMiddlewareArray | [],
	Strict extends Boolean = true,
	RequiredRequest extends BaseRequest<any, any, any, any> = BaseRequest<any, any, any, any>,
	RequiredResponse extends BaseResponse<any> = BaseResponse<any>,
> =
	z.infer<Controller['body']> extends EmptyObject
		? ValidateController<Controller, Middlewares, RequiredRequest, RequiredResponse>
		: Strict extends true
			? never
			: ValidateController<Controller, Middlewares, RequiredRequest, RequiredResponse>

export type HeaderValue = string | string[]
export type Headers = Record<string, HeaderValue>

export interface SendOptions {
	/**
	 * Enable or disable accepting ranged requests, defaults to true.
	 * Disabling this will not send Accept-Ranges and ignore the contents of the Range request header.
	 */
	acceptRanges?: boolean | undefined

	/**
	 * Enable or disable setting Cache-Control response header, defaults to true.
	 * Disabling this will ignore the maxAge option.
	 */
	cacheControl?: boolean | undefined

	/**
	 * Set how "dotfiles" are treated when encountered.
	 * A dotfile is a file or directory that begins with a dot (".").
	 * Note this check is done on the path itself without checking if the path actually exists on the disk.
	 * If root is specified, only the dotfiles above the root are checked (i.e. the root itself can be within a dotfile when when set to "deny").
	 * 'allow' No special treatment for dotfiles.
	 * 'deny' Send a 403 for any request for a dotfile.
	 * 'ignore' Pretend like the dotfile does not exist and 404.
	 * The default value is similar to 'ignore', with the exception that this default will not ignore the files within a directory that begins with a dot, for backward-compatibility.
	 */
	dotfiles?: 'allow' | 'deny' | 'ignore' | undefined

	/**
	 * Byte offset at which the stream ends, defaults to the length of the file minus 1.
	 * The end is inclusive in the stream, meaning end: 3 will include the 4th byte in the stream.
	 */
	end?: number | undefined

	/**
	 * Enable or disable etag generation, defaults to true.
	 */
	etag?: boolean | undefined

	/**
	 * If a given file doesn't exist, try appending one of the given extensions, in the given order.
	 * By default, this is disabled (set to false).
	 * An example value that will serve extension-less HTML files: ['html', 'htm'].
	 * This is skipped if the requested file already has an extension.
	 */
	extensions?: string[] | string | boolean | undefined

	/**
	 * Enable or disable the immutable directive in the Cache-Control response header, defaults to false.
	 * If set to true, the maxAge option should also be specified to enable caching.
	 * The immutable directive will prevent supported clients from making conditional requests during the life of the maxAge option to check if the file has changed.
	 * @default false
	 */
	immutable?: boolean | undefined

	/**
	 * By default send supports "index.html" files, to disable this set false or to supply a new index pass a string or an array in preferred order.
	 */
	index?: string[] | string | boolean | undefined

	/**
	 * Enable or disable Last-Modified header, defaults to true.
	 * Uses the file system's last modified value.
	 */
	lastModified?: boolean | undefined

	/**
	 * Provide a max-age in milliseconds for http caching, defaults to 0.
	 * This can also be a string accepted by the ms module.
	 */
	maxAge?: string | number | undefined

	/**
	 * Serve files relative to path.
	 */
	root?: string | undefined

	/**
	 * Byte offset at which the stream starts, defaults to 0.
	 * The start is inclusive, meaning start: 2 will include the 3rd byte in the stream.
	 */
	start?: number | undefined
}

export interface SendFileOptions extends SendOptions {
	/** Object containing HTTP headers to serve with the file. */
	headers?: Record<string, unknown>
}

export interface DownloadOptions extends SendOptions {
	/** Object containing HTTP headers to serve with the file. The header `Content-Disposition` will be overridden by the filename argument. */
	headers?: Record<string, unknown>
}

export interface CookieOptions {
	/** Convenient option for setting the expiry time relative to the current time in **milliseconds**. */
	maxAge?: number
	/** Indicates if the cookie should be signed. */
	signed?: boolean
	/** Expiry date of the cookie in GMT. If not specified or set to 0, creates a session cookie. */
	expires?: Date
	/** Flags the cookie to be accessible only by the web server. */
	httpOnly?: boolean
	/** Path for the cookie. Defaults to “/”. */
	path?: string
	/** Domain name for the cookie. Defaults to the domain name of the app. */
	domain?: string
	/** Marks the cookie to be used with HTTPS only. */
	secure?: boolean
	/**
	 * Value of the "SameSite" Set-Cookie attribute.
	 * @link https://tools.ietf.org/html/draft-ietf-httpbis-cookie-same-site-00#section-4.1.1.
	 */
	sameSite?: boolean | 'lax' | 'strict' | 'none'
	/**
	 * Value of the "Priority" Set-Cookie attribute.
	 * @link https://datatracker.ietf.org/doc/html/draft-west-cookie-priority-00#section-4.3
	 */
	priority?: 'low' | 'medium' | 'high'
}

export interface QueryParams {
	[key: string]: string | QueryParams | QueryParams[]
}

export interface PathParams {
	[key: string]: string
}

export interface CookiesObject {
	[key: string]: string
}
