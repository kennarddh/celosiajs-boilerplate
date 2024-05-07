import { Request } from 'express'

import { IncomingHttpHeaders } from 'http'

import {
	BaseController,
	BaseRequest,
	CookiesObject,
	EmptyObject,
	HeaderValue,
	JSON,
	PathParams,
	QueryParams,
} from 'Internals'
import RangeParser from 'range-parser'
import { z } from 'zod'

export type IControllerExpressRequest<Controller extends BaseController<any, any, any>> =
	ExpressRequest<
		{} extends z.infer<Controller['body']> ? EmptyObject : z.infer<Controller['body']>,
		{} extends z.infer<Controller['query']> ? EmptyObject : z.infer<Controller['query']>,
		{} extends z.infer<Controller['params']> ? EmptyObject : z.infer<Controller['params']>,
		{} extends z.infer<Controller['cookies']> ? EmptyObject : z.infer<Controller['cookies']>
	>

class ExpressRequest<
	Body extends JSON = EmptyObject,
	Query extends QueryParams = EmptyObject,
	Params extends PathParams = EmptyObject,
	Cookies extends CookiesObject = EmptyObject,
> extends BaseRequest<Body, Query, Params, Cookies> {
	protected _expressRequest: Request

	/**
	 * Harder migration to other http library if used
	 */
	public get expressRequest() {
		return this._expressRequest
	}

	constructor(expressRequest: Request) {
		super()

		this._expressRequest = expressRequest

		expressRequest.on('close', () => this.emit('close'))
		expressRequest.on('data', data => this.emit('data', data))
		expressRequest.on('end', () => this.emit('end'))
		expressRequest.on('error', error => this.emit('error', error))
		expressRequest.on('pause', () => this.emit('pause'))
		expressRequest.on('readable', () => this.emit('readable'))
		expressRequest.on('resume', () => this.emit('resume'))
	}

	public get body(): Body {
		return this.expressRequest.body
	}

	public get query(): Query {
		return this.expressRequest.query as Query
	}

	public get params(): Params {
		return this.expressRequest.params as Params
	}

	public get cookies(): Cookies {
		return this.expressRequest.cookies as Cookies
	}

	public get headers(): IncomingHttpHeaders {
		return this.expressRequest.headers
	}

	/**
	 * Return request header.
	 *
	 * The `Referrer` header field is special-cased,
	 * both `Referrer` and `Referer` are interchangeable.
	 *
	 * Examples:
	 *
	 *     req.header('Content-Type');
	 *     // => "text/plain"
	 *
	 *     req.header('content-type');
	 *     // => "text/plain"
	 *
	 *     req.header('Something');
	 *     // => undefined
	 */
	public header(name: string): HeaderValue | undefined {
		return this.expressRequest.header(name)
	}

	/**
	 * Check if the given `type(s)` is acceptable, returning
	 * the best match when true, otherwise `undefined`, in which
	 * case you should respond with 406 "Not Acceptable".
	 *
	 * The `type` value may be a single mime type string
	 * such as "application/json", the extension name
	 * such as "json", a comma-delimted list such as "json, html, text/plain",
	 * or an array `["json", "html", "text/plain"]`. When a list
	 * or array is given the best match, if any is returned.
	 *
	 * Examples:
	 *
	 *     // Accept: text/html
	 *     req.accepts('html');
	 *     // => "html"
	 *
	 *     // Accept: text/*, application/json
	 *     req.accepts('html');
	 *     // => "html"
	 *     req.accepts('text/html');
	 *     // => "text/html"
	 *     req.accepts('json, text');
	 *     // => "json"
	 *     req.accepts('application/json');
	 *     // => "application/json"
	 *
	 *     // Accept: text/*, application/json
	 *     req.accepts('image/png');
	 *     req.accepts('png');
	 *     // => false
	 *
	 *     // Accept: text/*;q=.5, application/json
	 *     req.accepts(['html', 'json']);
	 *     req.accepts('html, json');
	 *     // => "json"
	 */
	public accepts(): string[]
	public accepts(...type: string[]): string | false
	public accepts(...type: string[]): string[] | string | false {
		return this.expressRequest.accepts(type)
	}

	/**
	 * Returns the first accepted charset of the specified character sets,
	 * based on the request's Accept-Charset HTTP header field.
	 * If none of the specified charsets is accepted, returns false.
	 *
	 * For more information, or if you have issues or concerns, see accepts.
	 */
	public acceptsCharsets(): string[]
	public acceptsCharsets(...charset: string[]): string | false
	public acceptsCharsets(...charset: string[]): string[] | string | false {
		return this.expressRequest.acceptsCharsets(charset)
	}

	/**
	 * Returns the first accepted encoding of the specified encodings,
	 * based on the request's Accept-Encoding HTTP header field.
	 * If none of the specified encodings is accepted, returns false.
	 *
	 * For more information, or if you have issues or concerns, see accepts.
	 */
	public acceptsEncodings(): string[]
	public acceptsEncodings(...encoding: string[]): string | false
	public acceptsEncodings(...encoding: string[]): string[] | string | false {
		return this.expressRequest.acceptsEncodings(encoding)
	}

	/**
	 * Returns the first accepted language of the specified languages,
	 * based on the request's Accept-Language HTTP header field.
	 * If none of the specified languages is accepted, returns false.
	 *
	 * For more information, or if you have issues or concerns, see accepts.
	 */
	public acceptsLanguages(): string[]
	public acceptsLanguages(...lang: string[]): string | false
	public acceptsLanguages(...lang: string[]): string[] | string | false {
		return this.expressRequest.acceptsLanguages(lang)
	}

	/**
	 * Parse Range header field, capping to the given `size`.
	 *
	 * Unspecified ranges such as "0-" require knowledge of your resource length. In
	 * the case of a byte range this is of course the total number of bytes.
	 * If the Range header field is not given `undefined` is returned.
	 * If the Range header field is given, return value is a result of range-parser.
	 * See more ./types/range-parser/index.d.ts
	 *
	 * NOTE: remember that ranges are inclusive, so for example "Range: users=0-3"
	 * should respond with 4 users when available, not 3.
	 */
	public range(
		size: number,
		options?: RangeParser.Options,
	): RangeParser.Ranges | RangeParser.Result | undefined {
		return this.expressRequest.range(size, options)
	}

	/**
	 * Return the protocol string "http" or "https"
	 * when requested with TLS. When the "trust proxy"
	 * setting is enabled the "X-Forwarded-Proto" header
	 * field will be trusted. If you're running behind
	 * a reverse proxy that supplies https for you this
	 * may be enabled.
	 */
	public get protocol(): 'http' | 'https' {
		return this.expressRequest.protocol as 'http' | 'https'
	}

	/**
	 * Return the remote address, or when
	 * "trust proxy" is `true` return
	 * the upstream addr.
	 *
	 * Value may be undefined if the `req.socket` is destroyed
	 * (for example, if the client disconnected).
	 */
	public get ip(): string | undefined {
		return this.expressRequest.ip
	}

	/**
	 * When "trust proxy" is `true`, parse
	 * the "X-Forwarded-For" ip address list.
	 *
	 * For example if the value were "client, proxy1, proxy2"
	 * you would receive the array `["client", "proxy1", "proxy2"]`
	 * where "proxy2" is the furthest down-stream.
	 */
	public get ips(): string[] {
		return this.expressRequest.ips
	}

	/**
	 * Return subdomains as an array.
	 *
	 * Subdomains are the dot-separated parts of the host before the main domain of
	 * the app. By default, the domain of the app is assumed to be the last two
	 * parts of the host. This can be changed by setting "subdomain offset".
	 *
	 * For example, if the domain is "tobi.ferrets.example.com":
	 * If "subdomain offset" is not set, req.subdomains is `["ferrets", "tobi"]`.
	 * If "subdomain offset" is 3, req.subdomains is `["tobi"]`.
	 */
	public get subdomains(): string[] {
		return this.expressRequest.subdomains
	}

	/**
	 * Short-hand for `url.parse(req.url).pathname`.
	 */
	public get path(): string {
		return this.expressRequest.path
	}

	/**
	 * Parse the "Host" header field hostname.
	 */
	public get hostname(): string {
		return this.expressRequest.hostname
	}

	/**
	 * Check if the request is fresh, aka
	 * Last-Modified and/or the ETag
	 * still match.
	 */
	public get fresh(): boolean {
		return this.expressRequest.fresh
	}

	/**
	 * Check if the request was an "XMLHttpRequest".
	 */
	public get xhr(): boolean {
		return this.expressRequest.xhr
	}

	public get method(): string {
		return this.expressRequest.method
	}
}

export default ExpressRequest
