import { body } from 'express-validator'

import FindUserByEmailOrUsername from 'Services/User/FindByEmailOrUsername'

import CheckValidationError from 'Middlewares/CheckValidationError'

const Register = () => {
	const validator = [
		body('username')
			.trim()
			.not()
			.isEmpty()
			.withMessage('Username cannot be empty')
			.bail()
			.escape()
			.isLength({ max: 32 })
			.withMessage('Username must be a maximum of 32 characters')
			.bail(),
		body('name')
			.trim()
			.not()
			.isEmpty()
			.withMessage('Name cannot be empty')
			.bail()
			.escape()
			.isLength({ max: 32 })
			.withMessage('Name must be a maximum of 32 characters'),
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

export default Register
