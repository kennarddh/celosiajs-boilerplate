class UserExistsError extends Error {
	constructor() {
		super('User already exists')
	}
}

export default UserExistsError
