export const String = (length: number) => {
	const characters =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

	let result = ''

	for (let i = 0; i < length; i += 1) {
		result += characters.charAt(
			Math.floor(Math.random() * characters.length),
		)
	}

	return result
}

export const RandomNumber = (min: number, max: number) =>
	Math.floor(Math.random() * (max - min + 1)) + min

export const StringRandomLength = (min: number, max: number) => {
	const length = RandomNumber(min, max)

	return String(length)
}
