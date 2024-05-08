import { RequestHandler } from 'express'

import { BaseMiddleware, EmptyObject, ExpressRequest, ExpressResponse } from 'Internals'

/**
 * deferToNext in the expressMiddleware NextFunction is ignored
 */
const ConvertExpressMiddleware = (expressMiddleware: RequestHandler) => {
	return class extends BaseMiddleware {
		public override async index(
			_: EmptyObject,
			request: ExpressRequest<{ id: string }>,
			response: ExpressResponse<JSON>,
		) {
			await new Promise<void>((resolve, reject) => {
				expressMiddleware(
					request.expressRequest,
					response.expressResponse,
					(errorOrDeferToNext?: any) => {
						// If value is truthy
						if (!errorOrDeferToNext) return resolve()

						// Ignore defer to next
						if (errorOrDeferToNext === 'route' || errorOrDeferToNext === 'router')
							return resolve()

						reject(errorOrDeferToNext)
					},
				)
			})
		}
	}
}

export default ConvertExpressMiddleware
