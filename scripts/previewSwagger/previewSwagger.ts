import express, { Response } from 'express'

import { watch } from 'node:fs/promises'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'

import cors from 'cors'
import open from 'open'
import swaggerUIDist from 'swagger-ui-dist'

import debounce from '../utils/debouce'

const app = express()

const PORT = 8888

app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

let clients: Response[] = []

const getNewestSpec = () => {
	execSync('npm run build:swagger')

	const text = JSON.stringify(
		JSON.parse(
			readFileSync(path.resolve(__dirname, '../../src/Swagger.json'), {
				encoding: 'utf8',
				flag: 'r',
			})
		)
	)

	return text
}

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
	res.send(getNewestSpec())
})

app.get('/', (_, res) => {
	res.sendFile(path.resolve(__dirname, './index.html'))
})

app.use(express.static(swaggerUIDist.absolutePath()))

const debounced = debounce(() => {
	const text = getNewestSpec()

	clients.forEach(res => {
		res.write(`data: ${text} \n\n`)
	})
}, 1000)

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
