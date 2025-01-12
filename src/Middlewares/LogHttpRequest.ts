import { IncomingHttpHeaders, OutgoingHttpHeaders } from 'http'

import {
	BaseMiddleware,
	CelosiaRequest,
	CelosiaResponse,
	EmptyObject,
	NextFunction,
} from '@celosiajs/core'

const FilterHeaders = (headers: IncomingHttpHeaders | OutgoingHttpHeaders) => {
	const { 'access-token': _, 'set-cookie': __, cookie: ___, ...newHeaders } = headers

	return newHeaders
}

class LogHttpRequest extends BaseMiddleware {
	constructor() {
		super('LogHttpRequest')
	}

	public override async index(
		_: EmptyObject,
		request: CelosiaRequest,
		response: CelosiaResponse,
		next: NextFunction,
	) {
		const requestStart = Date.now()

		response.expressResponse.on('finish', () => {
			const {
				headers,
				httpVersion,
				method,
				socket: { remoteFamily },
				url,
			} = request

			const { statusCode, statusMessage } = response

			this.logger.http('Incoming request.', {
				requestId: request.id,
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

		next()
	}
}

export default LogHttpRequest
