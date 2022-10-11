import { validationResult } from 'express-validator'

import Logger from '../Utils/Logger/Logger'

const CheckValidationErrorFactory = () => {
	const CheckValidationError = (req, res, next) => {
		const result = validationResult(req)

		if (!result.isEmpty()) {
			const { method, url } = req

			const errors = result.array().map(({ msg }) => msg)

			Logger.verbose('Validation failed', {
				method,
				url,
			})

			return res.status(400).json({ errors, data: {} })
		}

		next()
	}

	return CheckValidationError
}

export default CheckValidationErrorFactory
