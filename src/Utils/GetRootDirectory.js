import path from 'path'

const GetRootDirectory = () => {
	if (process.env.NODE_ENV === 'production')
		return path.dirname(require.main.filename)

	return path.resolve(path.dirname(require.main.filename), '..')
}

export default GetRootDirectory
