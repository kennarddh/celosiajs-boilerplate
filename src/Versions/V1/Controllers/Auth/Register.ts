import { Request, Response } from 'express'

import argon2 from 'argon2'

import Logger from 'Utils/Logger/Logger.js'

import prisma from 'Database/index.js'

interface IBody {
	username: string
	name: string
	password: string
}

const Register = async (req: Request, res: Response) => {
	const { username, name, password }: IBody = req.body

	const hashedPassword = await argon2.hash(password, {
		hashLength: 64,
	})

	try {
		const user = await prisma.user.create({
			data: {
				username,
				name,
				password: hashedPassword,
			},
		})

		return res.status(201).json({
			errors: [],
			data: {
				id: user.id,
			},
		})
	} catch (error) {
		Logger.error('Register controller failed to create user', {
			username,
			error,
		})

		return res.status(500).json({
			errors: ['Internal server error'],
			data: {},
		})
	}
}

export default Register
