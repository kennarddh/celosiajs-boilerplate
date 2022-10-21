import path from 'node:path'

const GetRootDirectory = (): string => {
	return path.resolve(__dirname, '../..')
}

export default GetRootDirectory
