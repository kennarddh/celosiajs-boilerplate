import { body } from 'express-validator'

// Middleware
import CheckValidationError from '../../Middlewares/CheckValidationError'

import FindUserByEmailOrUsername from '../../Services/User/FindByEmailOrUsername'

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
				await FindUserByEmailOrUsername({
					email: value,
					username: req.body.username,
				})
					.then(() => {
						throw new Error('Username or email has already taken')
					})
					.catch(error => {
						if (error.code === 404) return true

						if (
							error.message ===
							'Username or email has already taken'
						) {
							throw new Error(
								'Username or email has already taken'
							)
						} else {
							throw new Error('Internal Server Error')
						}
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
