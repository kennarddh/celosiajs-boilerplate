class TokenSignError extends Error {
	constructor() {
		super('Failed to sign token')
	}
}

export default TokenSignError
