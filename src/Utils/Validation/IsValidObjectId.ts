import { Types } from 'mongoose'

/**
 *  Use with express-validator
 *  Usage `.custom(IsValidObjectId('id'))`
 */
const IsValidObjectId =
	(field = 'id') =>
	(value: string) => {
		if (Types.ObjectId.isValid(value)) return true

		throw new Error(`Invalid ${field}`)
	}

export default IsValidObjectId
