import { body } from 'express-validator'

// Middleware
import CheckValidationError from '../../Middlewares/CheckValidationError'

// Models
import User from '../../Models/User'

const Register = () => {
	const validator = [
		body('username')
			.trim()
			.not()
			.isEmpty()
			.bail()
			.escape()
			.isLength({ max: 32 })
			.bail(),
		body('name')
			.trim()
			.not()
			.isEmpty()
			.bail()
			.escape()
			.isLength({ max: 32 }),
		body('email')
			.trim()
			.not()
			.isEmpty()
			.bail()
			.escape()
			.isEmail()
			.bail()
			.normalizeEmail({ all_lowercase: true })
			.custom(async (value, { req }) => {
				await User.findOne({
					$or: [{ email: value }, { username: req.body.username }],
				})
					.exec()
					.then(user => {
						if (!user) return true

						throw new Error('Username or email has already taken')
					})
			}),
		body('password')
			.trim()
			.not()
			.isEmpty()
			.bail()
			.isString()
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

export default Register
