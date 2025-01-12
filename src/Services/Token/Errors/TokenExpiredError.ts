class TokenExpiredError extends Error {
	constructor(public expiredAt: Date) {
		super('Token is expired')
	}
}

export default TokenExpiredError
