import { NextFunction, Request, Response } from 'express'

import { validationResult } from 'express-validator'

import Logger from 'Utils/Logger/Logger.js'

const CheckValidationErrorFactory = () => {
	const CheckValidationError = (
		req: Request,
		res: Response,
		next: NextFunction,
	) => {
		const result = validationResult(req)

		if (!result.isEmpty()) {
			const { method, url } = req

			const errors: string[] = result.array().map(({ msg }) => msg)

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
