export const string = (length: number) => {
	const characters =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

	let result = ''

	for (let i = 0; i < length; i += 1) {
		result += characters.charAt(
			Math.floor(Math.random() * characters.length)
		)
	}

	return result
}

export const randomNumber = (min: number, max: number) =>
	Math.floor(Math.random() * (max - min + 1)) + min

export const stringRandomLength = (min: number, max: number) => {
	const length = randomNumber(min, max)

	return string(length)
}
