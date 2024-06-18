import { Request } from 'express'

import { IncomingHttpHeaders } from 'http'

import { Socket } from 'net'
import RangeParser from 'range-parser'
import { TypedEmitter } from 'tiny-typed-emitter'

import {
	CookiesObject,
	EmptyObject,
	IncomingHeaderValue,
	JSON,
	PathParams,
	QueryParams,
} from 'Internals'

export interface RequestEvents {
	close: () => void
	data: (chunk: Buffer) => void
	end: () => void
	error: (error: Error) => void
	pause: () => void
	readable: () => void
	resume: () => void
}

class ExpressRequest<
	Body extends EmptyObject | JSON = EmptyObject,
	Query extends EmptyObject | QueryParams = EmptyObject,
	Params extends EmptyObject | PathParams = EmptyObject,
	Cookies extends EmptyObject | CookiesObject = EmptyObject,
> extends TypedEmitter<RequestEvents> {
	protected _expressRequest: Request

	public get expressRequest() {
		return this._expressRequest
	}

	constructor(expressRequest: Request) {
		super()

		this._expressRequest = expressRequest

		expressRequest.on('close', () => this.emit('close'))
		expressRequest.on('data', (data: Buffer) => this.emit('data', data))
		expressRequest.on('end', () => this.emit('end'))
		expressRequest.on('error', error => this.emit('error', error))
		expressRequest.on('pause', () => this.emit('pause'))
		expressRequest.on('readable', () => this.emit('readable'))
		expressRequest.on('resume', () => this.emit('resume'))
	}

	public get body(): Body {
		return this.expressRequest.body as Body
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
	public header(name: string): IncomingHeaderValue | undefined {
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

	/**
	 * In case of server request, the HTTP version sent by the client. In the case of
	 * client response, the HTTP version of the connected-to server.
	 * Probably either `'1.1'` or `'1.0'`.
	 *
	 * Also `message.httpVersionMajor` is the first integer and `message.httpVersionMinor` is the second.
	 */
	public get httpVersion(): string {
		return this.expressRequest.httpVersion
	}

	public get httpVersionMajor(): number {
		return this.expressRequest.httpVersionMajor
	}

	public get httpVersionMinor(): number {
		return this.expressRequest.httpVersionMinor
	}

	/**
	 * The `message.complete` property will be `true` if a complete HTTP message has
	 * been received and successfully parsed.
	 *
	 * This property is particularly useful as a means of determining if a client or
	 * server fully transmitted a message before a connection was terminated:
	 *
	 * ```js
	 * const req = http.request({
	 *   host: '127.0.0.1',
	 *   port: 8080,
	 *   method: 'POST',
	 * }, (res) => {
	 *   res.resume();
	 *   res.on('end', () => {
	 *     if (!res.complete)
	 *       console.error(
	 *         'The connection was terminated while the message was still being sent');
	 *   });
	 * });
	 * ```
	 */
	public get complete(): boolean {
		return this.expressRequest.complete
	}

	/**
	 * The `net.Socket` object associated with the connection.
	 *
	 * With HTTPS support, use `request.socket.getPeerCertificate()` to obtain the
	 * client's authentication details.
	 *
	 * This property is guaranteed to be an instance of the `net.Socket` class,
	 * a subclass of `stream.Duplex`, unless the user specified a socket
	 * type other than `net.Socket` or internally nulled.
	 */
	public get socket(): Socket {
		return this.expressRequest.socket
	}

	/**
	 * Similar to `message.headers`, but there is no join logic and the values are
	 * always arrays of strings, even for headers received just once.
	 *
	 * ```js
	 * // Prints something like:
	 * //
	 * // { 'user-agent': ['curl/7.22.0'],
	 * //   host: ['127.0.0.1:8000'],
	 * //   accept: ['*'] }
	 * console.log(request.headersDistinct);
	 * ```
	 * @since v18.3.0, v16.17.0
	 */
	public get headersDistinct(): NodeJS.Dict<string[]> {
		return this.expressRequest.headersDistinct
	}

	/**
	 * The raw request/response headers list exactly as they were received.
	 *
	 * The keys and values are in the same list. It is _not_ a
	 * list of tuples. So, the even-numbered offsets are key values, and the
	 * odd-numbered offsets are the associated values.
	 *
	 * Header names are not lowercased, and duplicates are not merged.
	 *
	 * ```js
	 * // Prints something like:
	 * //
	 * // [ 'user-agent',
	 * //   'this is invalid because there can be only one',
	 * //   'User-Agent',
	 * //   'curl/7.22.0',
	 * //   'Host',
	 * //   '127.0.0.1:8000',
	 * //   'ACCEPT',
	 * //   '*' ]
	 * console.log(request.rawHeaders);
	 * ```
	 */
	public get rawHeaders(): string[] {
		return this.expressRequest.rawHeaders
	}

	/**
	 * The request/response trailers object. Only populated at the `'end'` event.
	 */
	public get trailers(): NodeJS.Dict<string> {
		return this.expressRequest.trailers
	}

	/**
	 * Similar to `message.trailers`, but there is no join logic and the values are
	 * always arrays of strings, even for headers received just once.
	 * Only populated at the `'end'` event.
	 */
	public get trailersDistinct(): NodeJS.Dict<string[]> {
		return this.expressRequest.trailersDistinct
	}
	/**
	 * The raw request/response trailer keys and values exactly as they were
	 * received. Only populated at the `'end'` event.
	 */
	public get rawTrailers(): string[] {
		return this.expressRequest.rawTrailers
	}

	/**
	 * Calls `message.socket.setTimeout(msecs, callback)`.
	 */
	public setTimeout(msecs: number, callback?: () => void): this {
		this.expressRequest.setTimeout(msecs, callback)

		return this
	}

	/**
	 * **Only valid for request obtained from {@link Server}.**
	 *
	 * Request URL string. This contains only the URL that is present in the actual
	 * HTTP request. Take the following request:
	 *
	 * ```http
	 * GET /status?name=ryan HTTP/1.1
	 * Accept: text/plain
	 * ```
	 *
	 * To parse the URL into its parts:
	 *
	 * ```js
	 * new URL(`http://${process.env.HOST ?? 'localhost'}${request.url}`);
	 * ```
	 *
	 * When `request.url` is `'/status?name=ryan'` and `process.env.HOST` is undefined:
	 *
	 * ```console
	 * $ node
	 * > new URL(`http://${process.env.HOST ?? 'localhost'}${request.url}`);
	 * URL {
	 *   href: 'http://localhost/status?name=ryan',
	 *   origin: 'http://localhost',
	 *   protocol: 'http:',
	 *   username: '',
	 *   password: '',
	 *   host: 'localhost',
	 *   hostname: 'localhost',
	 *   port: '',
	 *   pathname: '/status',
	 *   search: '?name=ryan',
	 *   searchParams: URLSearchParams { 'name' => 'ryan' },
	 *   hash: ''
	 * }
	 * ```
	 *
	 * Ensure that you set `process.env.HOST` to the server's host name, or consider replacing this part entirely. If using `req.headers.host`, ensure proper
	 * validation is used, as clients may specify a custom `Host` header.
	 */
	public get url(): string | undefined {
		return this.expressRequest.url
	}

	/**
	 * Calls `destroy()` on the socket that received the `IncomingMessage`. If `error ` is provided, an`'error'` event is emitted on the socket and `error` is passed
	 * as an argument to any listeners on the event.
	 * @since v0.3.0
	 */
	public destroy(error?: Error): this {
		this.expressRequest.destroy(error)

		return this
	}
}

export default ExpressRequest
