import express, { NextFunction, Request, Response } from 'express'

const ParseJson = (req: Request, res: Response, next: NextFunction) => {
	const errorHandler = (err: Error | null) => {
		if (err instanceof Error) {
			res.status(400).json({
				errors: ['Invalid json'],
				data: {},
			})

			return
		}

		next()
	}

	express.json()(req, res, errorHandler)
}
export default ParseJson
