import { Types } from 'mongoose'

const IsValidObjectId = (value: string) => {
	if (Types.ObjectId.isValid(value)) return true

	return false
}

export default IsValidObjectId
