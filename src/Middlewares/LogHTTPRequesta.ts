import { IncomingHttpHeaders, OutgoingHttpHeaders } from 'http'

import {
	CelosiaRequest,
	CelosiaResponse,
	EmptyObject,
	Middleware,
	NextFunction,
} from '@celosiajs/core'

const FilterHeaders = (headers: IncomingHttpHeaders | OutgoingHttpHeaders) => {
	const { 'access-token': _, 'set-cookie': __, cookie: ___, ...newHeaders } = headers

	return newHeaders
}

class LogHTTPRequest extends Middleware {
	constructor() {
		super('LogHTTPRequest')
	}

	public override async index(
		_: EmptyObject,
		request: CelosiaRequest,
		response: CelosiaResponse,
		next: NextFunction,
	) {
		const requestStart = process.hrtime.bigint()

		response.expressResponse.on('finish', () => {
			const {
				headers,
				httpVersion,
				method,
				socket: { remoteFamily },
				url,
			} = request

			const { statusCode, statusMessage } = response

			const requestEnd = process.hrtime.bigint()

			// Nanoseconds to milliseconds
			const requestProcessingTime = (requestEnd - requestStart) / 1_000_000n

			this.logger.http('Incoming request.', {
				requestId: request.id,
				processingTime: requestProcessingTime,
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

export default LogHTTPRequest
