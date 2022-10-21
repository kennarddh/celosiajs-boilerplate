import express, { Request, Response } from 'express'

const Router = express.Router()

Router.all('*', (_: Request, res: Response) => {
	return res.status(404).json({
		errors: ['Not found'],
		data: {},
	})
})

export default Router
