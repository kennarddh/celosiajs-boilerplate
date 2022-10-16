const string = length => {
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

const randomNumber = (min, max) =>
	Math.floor(Math.random() * (max - min + 1)) + min

const stringRandomLength = (min, max) => {
	const length = randomNumber(min, max)

	return string(length)
}

exports.string = string
exports.stringRandomLength = stringRandomLength
exports.randomNumber = randomNumber
