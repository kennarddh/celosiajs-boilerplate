import { OutgoingHttpHeaders } from 'http'

import { CookieOptions, DownloadOptions, Headers, JSON, SendFileOptions } from 'Internals'
import { Readable } from 'stream'
import { TypedEmitter } from 'tiny-typed-emitter'

export interface ResponseEvents {
	close: () => void
	drain: () => void
	error: (error: Error) => void
	finish: () => void
	pipe: (src: Readable) => void
	unpipe: (src: Readable) => void
}

abstract class BaseResponse<Body = JSON> extends TypedEmitter<ResponseEvents> {
	/**
	 * Set status `code`.
	 */
	public abstract status(statusCode: number): this

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
	public abstract sendStatus(statusCode: number): this

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
	public abstract send(body: Body): this

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
	public abstract json(json: Body extends JSON ? Body : never): this

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
	public abstract sendFile(path: string): Promise<void>
	public abstract sendFile(path: string, options: SendFileOptions): Promise<void>

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
	public abstract download(path: string): Promise<void>
	public abstract download(path: string, filename: string): Promise<void>
	public abstract download(
		path: string,
		filename: string,
		options: DownloadOptions,
	): Promise<void>

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
	public abstract contentType(type: string): this

	public abstract write(json: Body): this

	public abstract writeHead(statusCode: number, headers: OutgoingHttpHeaders): this

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
	public abstract header(name: string): number | string | string[] | undefined
	public abstract header(name: string, value: number | string | string[] | undefined): this
	public abstract header(headers: Headers): this
	public abstract get headers(): OutgoingHttpHeaders

	/**
	 * Property indicating if HTTP headers has been sent for the response.
	 */
	public abstract get headersSent(): boolean

	/** Clear cookie `name`. */
	public abstract clearCookie(name: string, options?: CookieOptions): this

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
	public abstract cookie(name: string, value: string, options: CookieOptions): this
	public abstract cookie(name: string, value: string): this

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
	public abstract location(url: string): this

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
	public abstract redirect(url: string): this
	public abstract redirect(status: number, url: string): this
}

export default BaseResponse
