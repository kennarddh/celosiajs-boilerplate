import { body } from 'express-validator'

import CheckValidationError from 'Middlewares/CheckValidationError'

const Login = () => {
	const validator = [
		body('email')
			.trim()
			.not()
			.isEmpty()
			.withMessage('Email cannot be empty')
			.bail()
			.escape()
			.isEmail()
			.withMessage('Invalid email')
			.bail()
			.normalizeEmail({ all_lowercase: true }),
		body('password')
			.trim()
			.not()
			.isEmpty()
			.withMessage('Password cannot be empty')
			.bail()
			.matches(/^(?!.*\s)/g)
			.withMessage('Password cannot have whitespace')
			.bail()
			.isLength({ min: 8, max: 32 })
			.withMessage(
				'Password must be a minimum of 8 characters and a maximum of 32 characters'
			)
			.bail()
			.toLowerCase(),
		CheckValidationError(),
	]

	return validator
}

export default Login
