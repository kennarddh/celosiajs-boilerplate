import path from 'path'

const GetRootDirectory = () => {
	return path.resolve(__dirname, '../..')
}

export default GetRootDirectory
