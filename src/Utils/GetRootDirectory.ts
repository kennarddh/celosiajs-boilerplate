import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const GetRootDirectory = (): string => {
	return resolve(__dirname, '../..')
}

export default GetRootDirectory
