// remove special character using regex
const RemoveSpecialCharacter = str => {
	return str.replace(/[^\w\s]/gi, '')
}

export default RemoveSpecialCharacter
