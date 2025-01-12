class UnauthorizedError extends Error {
	constructor() {
		super('Unauthorized')
	}
}

export default UnauthorizedError
