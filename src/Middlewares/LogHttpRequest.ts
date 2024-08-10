import { IncomingHttpHeaders, OutgoingHttpHeaders } from 'http'

import { BaseMiddleware, CelosiaRequest, CelosiaResponse, EmptyObject } from '@celosiajs/core'

import Logger from 'Utils/Logger/Logger'

const FilterHeaders = (headers: IncomingHttpHeaders | OutgoingHttpHeaders) => {
	const { 'access-token': _, 'set-cookie': __, cookie: ___, ...newHeaders } = headers

	return newHeaders
}

class LogHttpRequest extends BaseMiddleware {
	public override async index(
		_: EmptyObject,
		request: CelosiaRequest,
		response: CelosiaResponse,
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
