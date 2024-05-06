import { IncomingHttpHeaders } from 'http'

import { CookiesObject, EmptyObject, HeaderValue, JSON, PathParams, QueryParams } from 'Internals'
import RangeParser from 'range-parser'
import { TypedEmitter } from 'tiny-typed-emitter'

export interface RequestEvents {
	close: () => void
	data: (chunk: any) => void
	end: () => void
	error: (error: Error) => void
	pause: () => void
	readable: () => void
	resume: () => void
}

abstract class BaseRequest<
	Body extends JSON = EmptyObject,
	Query extends QueryParams = EmptyObject,
	Params extends PathParams = EmptyObject,
	Cookies extends CookiesObject = EmptyObject,
> extends TypedEmitter<RequestEvents> {
	public abstract get body(): Body
	public abstract get query(): Query
	public abstract get params(): Params
	public abstract get cookies(): Cookies

	public abstract get headers(): IncomingHttpHeaders

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
	public abstract header(name: string): HeaderValue | undefined

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
	public abstract accepts(): string[]
	public abstract accepts(...type: string[]): string | false

	/**
	 * Returns the first accepted charset of the specified character sets,
	 * based on the request's Accept-Charset HTTP header field.
	 * If none of the specified charsets is accepted, returns false.
	 *
	 * For more information, or if you have issues or concerns, see accepts.
	 */
	public abstract acceptsCharsets(): string[]
	public abstract acceptsCharsets(...charset: string[]): string | false

	/**
	 * Returns the first accepted encoding of the specified encodings,
	 * based on the request's Accept-Encoding HTTP header field.
	 * If none of the specified encodings is accepted, returns false.
	 *
	 * For more information, or if you have issues or concerns, see accepts.
	 */
	public abstract acceptsEncodings(): string[]
	public abstract acceptsEncodings(...encoding: string[]): string | false

	/**
	 * Returns the first accepted language of the specified languages,
	 * based on the request's Accept-Language HTTP header field.
	 * If none of the specified languages is accepted, returns false.
	 *
	 * For more information, or if you have issues or concerns, see accepts.
	 */
	public abstract acceptsLanguages(): string[]
	public abstract acceptsLanguages(...lang: string[]): string | false

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
	public abstract range(
		size: number,
		options?: RangeParser.Options,
	): RangeParser.Ranges | RangeParser.Result | undefined

	/**
	 * Return the protocol string "http" or "https"
	 * when requested with TLS. When the "trust proxy"
	 * setting is enabled the "X-Forwarded-Proto" header
	 * field will be trusted. If you're running behind
	 * a reverse proxy that supplies https for you this
	 * may be enabled.
	 */
	public abstract get protocol(): 'http' | 'https'

	/**
	 * Return the remote address, or when
	 * "trust proxy" is `true` return
	 * the upstream addr.
	 *
	 * Value may be undefined if the `req.socket` is destroyed
	 * (for example, if the client disconnected).
	 */
	public abstract get ip(): string | undefined

	/**
	 * When "trust proxy" is `true`, parse
	 * the "X-Forwarded-For" ip address list.
	 *
	 * For example if the value were "client, proxy1, proxy2"
	 * you would receive the array `["client", "proxy1", "proxy2"]`
	 * where "proxy2" is the furthest down-stream.
	 */
	public abstract get ips(): string[]

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
	public abstract get subdomains(): string[]

	/**
	 * Short-hand for `url.parse(req.url).pathname`.
	 */
	public abstract get path(): string

	/**
	 * Parse the "Host" header field hostname.
	 */
	public abstract get hostname(): string

	/**
	 * Check if the request is fresh, aka
	 * Last-Modified and/or the ETag
	 * still match.
	 */
	public abstract get fresh(): boolean

	/**
	 * Check if the request was an "XMLHttpRequest".
	 */
	public abstract get xhr(): boolean

	public abstract get method(): string
}

export default BaseRequest
