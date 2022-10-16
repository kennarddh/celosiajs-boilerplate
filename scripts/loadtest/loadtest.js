/* eslint-disable no-console */
const loadtest = require('loadtest')
const { resolve } = require('node:path')
const fs = require('node:fs')
const { stringRandomLength } = require('./utils/random')

const maxRequests = 10000

const results = { count: 0 }
const body = {}

const statusCallback = (_, result, latency) => {
	if (!result) return

	if (!Object.keys(results).includes(`${result.statusCode}`)) {
		results[result.statusCode] = []
	}

	results[result.statusCode].push({
		...result,
		requestJsonBody: body[result.requestIndex],
	})

	if (latency.totalRequests !== maxRequests) return

	console.log({
		meanLatencyMs: latency.meanLatencyMs,
		minLatencyMs: latency.minLatencyMs,
		maxLatencyMs: latency.maxLatencyMs,
		totalErrors: latency.totalErrors,
		totalTimeSeconds: latency.totalTimeSeconds,
		totalRequests: latency.totalRequests,
		errorPercentage: `${
			(latency.totalErrors / latency.totalRequests) * 100
		}%`,
		errorCodes: latency.errorCodes,
		rps: latency.rps,
	})
}

const generateBody = () => {
	// eslint-disable-next-line security/detect-object-injection
	body[results.count] = {
		username: `${results.count}-${stringRandomLength(1, 20)}`,
		email: `${results.count}-${stringRandomLength(1, 20)}@gmail.com`,
		name: `${results.count}-${stringRandomLength(1, 20)}`,
		password: `${results.count}-${stringRandomLength(8, 20)}`,
	}

	results.count += 1

	// eslint-disable-next-line security/detect-object-injection
	return body[results.count - 1]
}

const options = {
	url: 'http://localhost:8080/api/auth/register',
	maxRequests,
	concurrency: 1000,
	contentType: 'application/json',
	statusCallback,
	method: 'POST',
	body: generateBody.bind(this),
}

loadtest.loadTest(options, error => {
	if (error) return console.error('Got an error: %s', error)

	console.log('Tests run successfully')
	console.log('Writing result')

	const path = resolve(__dirname, `./${stringRandomLength(10, 10)}.json`)

	// eslint-disable-next-line security/detect-non-literal-fs-filename
	fs.writeFile(path, JSON.stringify(results, null, '\t'), err => {
		if (err) return console.log(err)

		console.log(`Result file write complete. Path ${path}`)
	})
})
