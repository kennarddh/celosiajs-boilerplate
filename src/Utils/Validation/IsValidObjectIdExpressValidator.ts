import IsValidObjectId from './IsValidObjectId'

/**
 *  Use with express-validator
 *  Usage `.custom(IsValidObjectId('id'))`
 */
const IsValidObjectIdExpressValidator =
	(field = 'id') =>
	(value: string) => {
		if (IsValidObjectId(value)) return true

		throw new Error(`Invalid ${field}`)
	}

export default IsValidObjectIdExpressValidator
