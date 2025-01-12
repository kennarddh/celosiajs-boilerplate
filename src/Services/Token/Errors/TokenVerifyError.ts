class TokenVerifyError extends Error {
	constructor() {
		super('Token is invalid')
	}
}

export default TokenVerifyError
