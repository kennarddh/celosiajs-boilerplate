import { IncomingHttpHeaders, OutgoingHttpHeaders } from 'http'

import { BaseMiddleware, EmptyObject, ExpressRequest, ExpressResponse } from 'Internals'

import Logger from 'Utils/Logger/Logger'

const FilterHeaders = (headers: IncomingHttpHeaders | OutgoingHttpHeaders) => {
	const { 'access-token': _, 'set-cookie': __, cookie: ___, ...newHeaders } = headers

	return newHeaders
}

class LogHttpRequest extends BaseMiddleware {
	public override async index(
		_: EmptyObject,
		request: ExpressRequest,
		response: ExpressResponse,
	) {
		const requestStart = Date.now()

		response.on('finish', () => {
			const {
				headers,
				httpVersion,
				method,
				socket: { remoteFamily },
				url,
			} = request

			const { statusCode, statusMessage } = response

			Logger.http({
				processingTime: Date.now() - requestStart,
				headers: FilterHeaders(headers),
				httpVersion,
				method,
				remoteFamily,
				url,
				response: {
					statusCode,
					statusMessage,
					headers: FilterHeaders(response.headers),
				},
			})
		})
	}
}

export default LogHttpRequest
