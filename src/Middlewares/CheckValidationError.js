import { validationResult } from 'express-validator'

import Logger from '../Utils/Logger/Logger'

const CheckValidationErrorFactory = callback => {
	const CheckValidationError = (req, res, next) => {
		const errors = validationResult(req)

		if (!errors.isEmpty()) {
			if (callback) callback(req)

			const { method, url } = req

			Logger.info('Validation failed', {
				method,
				url,
				errors: errors.array(),
			})

			return res
				.status(400)
				.json({ success: false, errors: errors.array() })
		}

		next()
	}

	return CheckValidationError
}

export default CheckValidationErrorFactory
