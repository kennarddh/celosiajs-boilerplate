import { body } from 'express-validator'

import Logger from 'Utils/Logger/Logger.js'

import CheckValidationError from 'Middlewares/CheckValidationError.js'

import prisma from 'Database/index.js'

const Register = () => {
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
			.bail()
			.custom(async value => {
				try {
					const user = await prisma.user.findFirst({
						where: { username: value },
						select: { id: true },
					})

					if (user != null)
						throw new Error('Username or email has already taken')
				} catch (error) {
					Logger.error('Username validation findFirst error', {
						error,
					})

					throw new Error('Internal Server Error')
				}
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
			.isLength({ min: 8, max: 100 })
			.withMessage(
				'Password must be a minimum of 8 characters and a maximum of 100 characters',
			)
			.bail()
			.toLowerCase(),
		body('name')
			.trim()
			.not()
			.isEmpty()
			.withMessage('Name cannot be empty')
			.bail()
			.escape()
			.isLength({ max: 100 })
			.withMessage('Name must be a maximum of 100 characters'),
		CheckValidationError(),
	]

	return validator
}

export default Register
