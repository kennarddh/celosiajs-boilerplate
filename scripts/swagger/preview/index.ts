import express, { Response } from 'express'

import path from 'path'

import cors from 'cors'
import { readFile, watch } from 'fs/promises'
import swaggerUIDist from 'swagger-ui-dist'

const app = express()

const PORT = 8888

app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

let clients: Response[] = []

const getSpec = () =>
	new Promise(resolve => {
		readFile(path.resolve(__dirname, '../../../src/Swagger.json'), {
			encoding: 'utf8',
			flag: 'r',
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
	getSpec().then(text => {
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

const update = () => {
	getSpec().then(text => {
		clients.forEach(res => {
			res.write(`data: ${text} \n\n`)
		})
	})
}

const watcher = watch(path.resolve(__dirname, '../../../src/Swagger.json'), {
	recursive: true,
})

const main = async () => {
	// eslint-disable-next-line no-restricted-syntax
	for await (const _ of watcher) {
		update()
	}
}

main()

app.listen(PORT, async () => {
	// eslint-disable-next-line no-console
	console.info(`Swagger preview server running`, {
		port: PORT,
		pid: process.pid,
	})

	// eslint-disable-next-line no-console
	console.log(`Running on http://localhost:${PORT}`)
})
