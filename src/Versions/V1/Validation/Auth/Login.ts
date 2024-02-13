import { body } from 'express-validator'

import CheckValidationError from 'Middlewares/CheckValidationError.js'

const Login = () => {
	const validator = [
		body('username')
			.trim()
			.not()
			.isEmpty()
			.withMessage('Username cannot be empty')
			.bail()
			.escape()
			.isLength({ max: 50 })
			.withMessage('Username must be a maximum of 50 characters')
			.bail(),
		body('password')
			.trim()
			.not()
			.isEmpty()
			.withMessage('Password cannot be empty')
			.bail()
			.matches(/^(?!.*\s)/g)
			.withMessage('Password cannot have whitespace')
			.bail()
			.isLength({ min: 8, max: 100 })
			.withMessage(
				'Password must be a minimum of 8 characters and a maximum of 100 characters',
			)
			.bail()
			.toLowerCase(),
		CheckValidationError(),
	]

	return validator
}

export default Login
