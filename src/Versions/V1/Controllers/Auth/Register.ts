import { Request, Response } from 'express'

import CreateUser from 'Services/User/Create'

interface IBody {
	username: string
	name: string
	email: string
	password: string
}

const Register = (req: Request, res: Response) => {
	const { username, name, email, password }: IBody = req.body

	CreateUser({ username, name, email, password })
		.then(({ user }) => {
			return res.status(201).json({
				errors: [],
				data: {
					id: user._id,
				},
			})
		})
		.catch(() => {
			return res.status(500).json({
				errors: ['Internal server error'],
				data: {},
			})
		})
}

export default Register
