import path from 'path'

const GetRootDirectory = (): string => {
	return path.resolve(__dirname, '../..')
}

export default GetRootDirectory
