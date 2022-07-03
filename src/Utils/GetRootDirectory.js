import path from 'path'

path.dirname(require.main.filename)

const GetRootDirectory = () => {
	return path.resolve(path.dirname(require.main.filename), '..')
}

export default GetRootDirectory
