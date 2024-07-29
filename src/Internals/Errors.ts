export class InvalidExtensionError extends Error {
	constructor(message?: string, options?: ErrorOptions) {
		super(message, options)

		this.name = 'InvalidExtensionError'
	}
}

export class DuplicateExtensionError extends Error {
	constructor(message?: string, options?: ErrorOptions) {
		super(message, options)

		this.name = 'DuplicateExtensionError'
	}
}
