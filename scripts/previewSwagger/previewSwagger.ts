import express, { Response } from 'express'

import { watch, readFile } from 'node:fs/promises'
import path from 'node:path'
import { promisify } from 'node:util'
import { exec as originalExec } from 'node:child_process'

import cors from 'cors'
import open from 'open'
import swaggerUIDist from 'swagger-ui-dist'

import debounce from '../utils/debouce'

const exec = promisify(originalExec)

const app = express()

const PORT = 8888

app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

let clients: Response[] = []

const getNewestSpec = () =>
	new Promise(resolve => {
		exec('npm run build:swagger')
			.then(() => {
				return readFile(
					path.resolve(__dirname, '../../src/Swagger.json'),
					{
						encoding: 'utf8',
						flag: 'r',
					}
				)
			})
			.then((data: string) => {
				const text = JSON.stringify({
					error: false,
					message: JSON.parse(data),
				})

				resolve(text)
			})
			.catch((err: Error & { stderr: string }) => {
				const text = JSON.stringify({
					error: true,
					message: err.stderr,
				})

				resolve(text)
			})
	})

app.get('/events', (req, res) => {
	res.setHeader('Cache-Control', 'no-cache')
	res.setHeader('Content-Type', 'text/event-stream')
	res.setHeader('Connection', 'keep-alive')
	res.flushHeaders() // flush the headers to establish SSE with client

	clients.push(res)

	req.on('close', () => {
		clients = clients.filter(client => client !== res)
	})
})

app.get('/data', (_, res) => {
	getNewestSpec().then(text => {
		clients.forEach(res2 => {
			res2.write(`data: ${text} \n\n`)
		})

		res.status(204).end()
	})
})

app.get('/', (_, res) => {
	res.sendFile(path.resolve(__dirname, './index.html'))
})

app.use(express.static(swaggerUIDist.absolutePath()))

const debounced = debounce(() => {
	getNewestSpec().then(text => {
		clients.forEach(res => {
			res.write(`data: ${text} \n\n`)
		})
	})
}, 500)

const watcher = watch(path.resolve(__dirname, '../../src/Swagger/'), {
	recursive: true,
})

const main = async () => {
	// eslint-disable-next-line no-restricted-syntax
	for await (const _ of watcher) {
		debounced()
	}
}

main()

app.listen(PORT, () => {
	// eslint-disable-next-line no-console
	console.info(`Swagger preview server running`, {
		port: PORT,
		pid: process.pid,
	})

	open(`http://127.0.0.1:${PORT}`)
})
