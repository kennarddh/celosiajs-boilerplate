const RemoveXAccessToken = headers => {
	const newHeaders = {}

	Object.keys(headers).forEach(key => {
		if (key === 'x-access-token') return

		// eslint-disable-next-line security/detect-object-injection
		newHeaders[key] = headers[key]
	})

	return newHeaders
}

const LogHttpRequest = (req, res, next) => {
	const requestStart = Date.now()

	res.on('finish', () => {
		const {
			headers,
			httpVersion,
			method,
			socket: { remoteFamily },
			url,
		} = req

		console.log(
			JSON.stringify({
				timestamp: Date.now(),
				processingTime: Date.now() - requestStart,
				headers: RemoveXAccessToken(headers),
				httpVersion,
				method,
				remoteFamily,
				url,
			})
		)
	})

	next()
}

export default LogHttpRequest
