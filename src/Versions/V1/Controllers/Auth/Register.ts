import argon2 from 'argon2'
import { z } from 'zod'

import { BaseController, EmptyObject, ExpressResponse, IControllerRequest } from 'Internals'

import Logger from 'Utils/Logger/Logger'

import prisma from 'Database/index'

class Register extends BaseController {
	public async index(
		_: EmptyObject,
		request: IControllerRequest<Register>,
		response: ExpressResponse,
	) {
		const { username, name, password } = request.body

		try {
			const user = await prisma.user.findFirst({
				where: { username },
				select: { id: true },
			})

			if (user != null)
				return response.status(422).json({
					errors: { others: ['Username is already taken'] },
					data: {},
				})
		} catch (error) {
			Logger.error('Register controller username validation findFirst error', {
				error,
			})

			throw new Error('Internal Server Error')
		}

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

			return response.status(201).json({
				errors: {},
				data: {
					id: user.id,
				},
			})
		} catch (error) {
			Logger.error('Register controller failed to create user', {
				username,
				error,
			})

			return response.status(500).json({
				errors: { others: ['Internal server error'] },
				data: {},
			})
		}
	}

	public override get body() {
		return z.object({
			name: z.string().trim().min(1).max(100),
			username: z.string().trim().min(1).max(50),
			password: z
				.string()
				.min(8)
				.max(100)
				.regex(/^(?!.*\s)/g, 'Must not contains white space.'),
		})
	}
}

export default Register
