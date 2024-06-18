import express, { NextFunction, Request, Response } from 'express'

const ParseJson = (req: Request, res: Response, next: NextFunction) => {
	const errorHandler = (err: Error | null) => {
		if (err instanceof Error) {
			res.status(422).json({
				errors: { others: ['Invalid json body'] },
				data: {},
			})

			return
		}

		next()
	}

	express.json()(req, res, errorHandler)
}

export default ParseJson
