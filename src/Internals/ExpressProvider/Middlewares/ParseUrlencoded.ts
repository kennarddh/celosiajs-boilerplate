import express, { NextFunction, Request, Response } from 'express'

const ParseUrlencoded = (req: Request, res: Response, next: NextFunction) => {
	const errorHandler = (err: Error | null) => {
		if (err instanceof Error) {
			res.status(422).json({
				errors: { others: ['Invalid urlencoded body'] },
				data: {},
			})

			return
		}

		next()
	}

	express.urlencoded({ extended: false })(req, res, errorHandler)
}

export default ParseUrlencoded
