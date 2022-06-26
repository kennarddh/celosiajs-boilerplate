import { body } from 'express-validator'

// Middleware
import CheckValidationError from '../../Middlewares/CheckValidationError'

const Login = () => {
	const validator = [
		body('email')
			.trim()
			.not()
			.isEmpty()
			.bail()
			.escape()
			.isEmail()
			.bail()
			.normalizeEmail({ all_lowercase: true }),
		body('password')
			.trim()
			.not()
			.isEmpty()
			.bail()
			.isString()
			.bail()
			.custom(value => {
				if (/\s/g.test(value)) {
					throw new Error('Password cannot have whitespace')
				} else {
					return true
				}
			})
			.bail()
			.isLength({ min: 8, max: 32 }),
		CheckValidationError(),
	]

	return validator
}

export default Login
