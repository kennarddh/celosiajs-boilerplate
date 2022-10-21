/* eslint-disable no-console */
import loadtest from 'loadtest'
import { resolve } from 'node:path'
import fs from 'node:fs'
import { stringRandomLength } from './utils/random'

const maxRequests = 10

interface IBodyValue {
	username: string
	email: string
	name: string
	password: string
}

type IBody = Record<number, IBodyValue>

interface IResult {
	requestJsonBody: IBodyValue | undefined
	[key: string]: number | string | IBodyValue | undefined
}

interface IResults {
	count: number
	[key: number]: IResult[]
}

const results: IResults = { count: 0 }
const body: IBody = {}

const statusCallback = (
	_: Error,
	result: {
		statusCode: number
		requestIndex: number
	},
	latency: {
		totalRequests: number
		meanLatencyMs: number
		minLatencyMs: number
		maxLatencyMs: number
		totalErrors: number
		totalTimeSeconds: number
		errorCodes: number
		rps: number
	}
) => {
	if (!result) return

	if (!Object.keys(results).includes(`${result.statusCode}`)) {
		results[result.statusCode] = []
	}

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const anyResults = results as any

	anyResults[result.statusCode].push({
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
	method: 'POST' as 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
	body: generateBody.bind(this),
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
loadtest.loadTest(options as any, (error: Error) => {
	if (error) return console.error('Got an error: %s', error)

	console.log('Tests run successfully')
	console.log('Writing result')

	const resultsDir = 'results'
	const resolvedResultsDir = resolve(__dirname, resultsDir)

	// eslint-disable-next-line security/detect-non-literal-fs-filename
	if (!fs.existsSync(resolvedResultsDir)) {
		// eslint-disable-next-line security/detect-non-literal-fs-filename
		fs.mkdirSync(resolvedResultsDir)
	}

	const path = resolve(
		__dirname,
		`./results/${stringRandomLength(10, 10)}.json`
	)

	// eslint-disable-next-line security/detect-non-literal-fs-filename
	fs.writeFile(path, JSON.stringify(results, null, '\t'), err => {
		if (err) return console.log(err)

		console.log(`Result file write complete. Path ${path}`)
	})
})
