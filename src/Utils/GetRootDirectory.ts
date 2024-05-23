import { resolve } from 'node:path'

const GetRootDirectory = (): string => {
	return resolve(import.meta.dirname, '../..')
}

export default GetRootDirectory
