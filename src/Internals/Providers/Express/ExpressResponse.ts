import { Response } from 'express'

import { OutgoingHttpHeaders } from 'http'

import {
	BaseResponse,
	CookieOptions,
	DownloadOptions,
	Headers,
	JSON,
	SendFileOptions,
} from 'Internals'

class ExpressResponse<Body = JSON> extends BaseResponse<Body> {
	protected _expressResponse: Response

	/**
	 * Harder migration to other http library if used
	 */
	public get expressResponse() {
		return this._expressResponse
	}

	constructor(expressResponse: Response) {
		super()

		this._expressResponse = expressResponse

		expressResponse.on('close', () => this.emit('close'))
		expressResponse.on('drain', () => this.emit('drain'))
		expressResponse.on('error', error => this.emit('error', error))
		expressResponse.on('finish', () => this.emit('finish'))
		expressResponse.on('unpipe', src => this.emit('unpipe', src))
		expressResponse.on('pipe', src => this.emit('pipe', src))
	}

	/**
	 * Set status `code`.
	 */
	public status(statusCode: number): this {
		this.expressResponse.status(statusCode)

		return this
	}

	/**
	 * Set the response HTTP status code to `statusCode` and send its string representation as the response body.
	 * @link http://expressjs.com/4x/api.html#res.sendStatus
	 *
	 * Examples:
	 *
	 *    res.sendStatus(200); // equivalent to res.status(200).send('OK')
	 *    res.sendStatus(403); // equivalent to res.status(403).send('Forbidden')
	 *    res.sendStatus(404); // equivalent to res.status(404).send('Not Found')
	 *    res.sendStatus(500); // equivalent to res.status(500).send('Internal Server Error')
	 */
	public sendStatus(statusCode: number): this {
		this.expressResponse.sendStatus(statusCode)

		return this
	}

	/**
	 * Send a response.
	 *
	 * Examples:
	 *
	 *     res.send(new Buffer('wahoo'));
	 *     res.send({ some: 'json' });
	 *     res.send('<p>some html</p>');
	 *     res.status(404).send('Sorry, cant find that');
	 */
	public send(body: Body): this {
		this.expressResponse.send(body)

		return this
	}

	/**
	 * Send JSON response.
	 *
	 * Examples:
	 *
	 *     res.json(null);
	 *     res.json({ user: 'tj' });
	 *     res.status(500).json('oh noes!');
	 *     res.status(404).json('I dont have that');
	 */
	public json(json: Body extends JSON ? Body : never): this {
		this.expressResponse.json(json)

		return this
	}

	/**
	 * Transfer the file at the given `path`.
	 *
	 * Automatically sets the _Content-Type_ response header field.
	 * The callback `fn(err)` is invoked when the transfer is complete
	 * or when an error occurs. Be sure to check `res.headersSent`
	 * if you wish to attempt responding, as the header and some data
	 * may have already been transferred.
	 *
	 * Options:
	 *
	 *   - `maxAge`   defaulting to 0 (can be string converted by `ms`)
	 *   - `root`     root directory for relative filenames
	 *   - `headers`  object of headers to serve with file
	 *   - `dotfiles` serve dotfiles, defaulting to false; can be `"allow"` to send them
	 *
	 * Other options are passed along to `send`.
	 *
	 * Examples:
	 *
	 *  The following example illustrates how `res.sendFile()` may
	 *  be used as an alternative for the `static()` middleware for
	 *  dynamic situations. The code backing `res.sendFile()` is actually
	 *  the same code, so HTTP cache support etc is identical.
	 *
	 *     app.get('/user/:uid/photos/:file', function(req, res){
	 *       var uid = req.params.uid
	 *         , file = req.params.file;
	 *
	 *       req.user.mayViewFilesFrom(uid, function(yes){
	 *         if (yes) {
	 *           res.sendFile('/uploads/' + uid + '/' + file);
	 *         } else {
	 *           res.send(403, 'Sorry! you cant see that.');
	 *         }
	 *       });
	 *     });
	 *
	 * @api public
	 */
	public sendFile(path: string): Promise<void>
	public sendFile(path: string, options: SendFileOptions): Promise<void>
	public async sendFile(path: string, options?: SendFileOptions): Promise<void> {
		return new Promise((resolve, reject) => {
			const errorCallback = (error: Error) => {
				if (error) return reject(error)

				resolve()
			}

			if (options) {
				this.expressResponse.sendFile(path, options, errorCallback)
			} else {
				this.expressResponse.sendFile(path, errorCallback)
			}
		})
	}

	/**
	 * Transfer the file at the given `path` as an attachment.
	 *
	 * Optionally providing an alternate attachment `filename`,
	 * and optional callback `fn(err)`. The callback is invoked
	 * when the data transfer is complete, or when an error has
	 * ocurred. Be sure to check `res.headersSent` if you plan to respond.
	 *
	 * The optional options argument passes through to the underlying
	 * res.sendFile() call, and takes the exact same parameters.
	 *
	 * This method uses `res.sendfile()`.
	 */
	public download(path: string): Promise<void>
	public download(path: string, filename: string): Promise<void>
	public download(path: string, filename: string, options: DownloadOptions): Promise<void>
	public async download(
		path: string,
		filename?: string,
		options?: DownloadOptions,
	): Promise<void> {
		return new Promise((resolve, reject) => {
			const errorCallback = (error: Error) => {
				if (error) return reject(error)

				resolve()
			}

			if (options && filename) {
				this.expressResponse.download(path, filename, options, errorCallback)
			} else if (filename) {
				this.expressResponse.download(path, filename, errorCallback)
			} else {
				this.expressResponse.download(path, errorCallback)
			}
		})
	}

	/**
	 * Set _Content-Type_ response header with `type` through `mime.lookup()`
	 * when it does not contain "/", or set the Content-Type to `type` otherwise.
	 *
	 * Examples:
	 *
	 *     res.type('.html');
	 *     res.type('html');
	 *     res.type('json');
	 *     res.type('application/json');
	 *     res.type('png');
	 */
	public contentType(type: string): this {
		this.expressResponse.contentType(type)

		return this
	}

	public write(body: Body): this {
		this.expressResponse.write(body)

		return this
	}

	public writeHead(statusCode: number, headers: OutgoingHttpHeaders): this {
		this.expressResponse.writeHead(statusCode, headers)

		return this
	}

	/**
	 * Set header `field` to `val`, or pass
	 * an object of header fields.
	 *
	 * Examples:
	 *
	 *    res.header('Foo', ['bar', 'baz']);
	 *    res.header('Accept', 'application/json');
	 *    res.header({ Accept: 'text/plain', 'X-API-Key': 'tobi' });
	 */
	public header(name: string): number | string | string[] | undefined
	public header(name: string, value: number | string | string[] | undefined): this
	public header(headers: Headers): this
	public header(
		nameOrHeaders: string | Headers,
		value?: string | string[],
	): number | string | string[] | undefined | this {
		if (typeof nameOrHeaders === 'string') {
			if (value) {
				this.expressResponse.header(nameOrHeaders, value)

				return this
			} else {
				return this.expressResponse.getHeader(nameOrHeaders)
			}
		}

		this.expressResponse.header(nameOrHeaders)

		return this
	}

	public get headers(): OutgoingHttpHeaders {
		return this.expressResponse.getHeaders()
	}

	/**
	 * Property indicating if HTTP headers has been sent for the response.
	 */
	public get headersSent(): boolean {
		return this.expressResponse.headersSent
	}

	/** Clear cookie `name`. */
	public clearCookie(name: string, options?: CookieOptions): this {
		if (options) this.expressResponse.clearCookie(name, options)
		else this.expressResponse.clearCookie(name)

		return this
	}

	/**
	 * Set cookie `name` to `value`, with the given `options`.
	 *
	 * Options:
	 *
	 *    - `maxAge`   max-age in milliseconds, converted to `expires`
	 *    - `signed`   sign the cookie
	 *    - `path`     defaults to "/"
	 *
	 * Examples:
	 *
	 *    // "Remember Me" for 15 minutes
	 *    res.cookie('rememberme', '1', { expires: new Date(Date.now() + 900000), httpOnly: true });
	 *
	 *    // save as above
	 *    res.cookie('rememberme', '1', { maxAge: 900000, httpOnly: true })
	 */
	public cookie(name: string, value: string, options: CookieOptions): this
	public cookie(name: string, value: string): this
	public cookie(name: string, value: string, options?: CookieOptions): this {
		if (options) this.expressResponse.cookie(name, value, options)
		else this.expressResponse.cookie(name, value)

		return this
	}

	/**
	 * Set the location header to `url`.
	 *
	 * The given `url` can also be the name of a mapped url, for
	 * example by default express supports "back" which redirects
	 * to the _Referrer_ or _Referer_ headers or "/".
	 *
	 * Examples:
	 *
	 *    res.location('/foo/bar').;
	 *    res.location('http://example.com');
	 *    res.location('../login'); // /blog/post/1 -> /blog/login
	 *
	 * Mounting:
	 *
	 *   When an application is mounted and `res.location()`
	 *   is given a path that does _not_ lead with "/" it becomes
	 *   relative to the mount-point. For example if the application
	 *   is mounted at "/blog", the following would become "/blog/login".
	 *
	 *      res.location('login');
	 *
	 *   While the leading slash would result in a location of "/login":
	 *
	 *      res.location('/login');
	 */
	public location(url: string): this {
		this.expressResponse.location(url)

		return this
	}

	/**
	 * Redirect to the given `url` with optional response `status`
	 * defaulting to 302.
	 *
	 * The resulting `url` is determined by `res.location()`, so
	 * it will play nicely with mounted apps, relative paths,
	 * `"back"` etc.
	 *
	 * Examples:
	 *
	 *    res.redirect('back');
	 *    res.redirect('/foo/bar');
	 *    res.redirect('http://example.com');
	 *    res.redirect(301, 'http://example.com');
	 *    res.redirect('http://example.com', 301);
	 *    res.redirect('../login'); // /blog/post/1 -> /blog/login
	 */
	public redirect(url: string): this
	public redirect(status: number, url: string): this
	public redirect(urlOrStatus: string | number, url?: string): this {
		if (typeof urlOrStatus === 'string') this.expressResponse.redirect(urlOrStatus)
		else this.expressResponse.redirect(urlOrStatus, url as string)

		return this
	}
}

export default ExpressResponse
