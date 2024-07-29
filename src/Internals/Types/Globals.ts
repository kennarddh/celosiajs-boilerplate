/* eslint-disable @typescript-eslint/no-unused-vars */
import { CookiesObject, EmptyObject, JSON, PathParams, QueryParams } from 'Internals'

/* eslint-disable @typescript-eslint/no-empty-interface */
declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace ExpressFramework {
		interface ExpressInstance<Strict extends boolean> {}
		interface ExpressRequest<
			Body extends EmptyObject | JSON,
			Query extends EmptyObject | QueryParams,
			Params extends EmptyObject | PathParams,
			Cookies extends EmptyObject | CookiesObject,
		> {}
		interface ExpressRouter<Strict extends boolean> {}
		interface ExpressResponse<Body> {}
	}
}
