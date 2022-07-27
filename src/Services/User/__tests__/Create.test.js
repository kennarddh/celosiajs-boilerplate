import * as mockingoose from 'mockingoose'

import bcrypt from 'bcrypt'

import Create from '../Create'

// Models
import User from '../../../Models/User'

describe('Create user service', () => {
	afterEach(() => {
		mockingoose.resetAll()
	})

	it('Should create new user', () => {
		expect.assertions(3)

		const user = {
			username: 'username',
			name: 'Name',
			email: 'email@example.com',
			password: 'password',
		}

		mockingoose(User).toReturn(user, 'save')

		const createPromise = Create(user).then(({ user: newUser }) => {
			expect(newUser.username).toBe(user.username)
			expect(newUser.name).toBe(user.name)
			expect(newUser.email).toBe(user.email)
		})

		return createPromise
	})

	it('Should failed if bcrypt reject', async () => {
		expect.assertions(1)

		const user = {
			username: 'username',
			name: 'Name',
			email: 'email@example.com',
			password: 'password',
		}

		const hash = jest.spyOn(bcrypt, 'hash')

		hash.mockRejectedValueOnce({ code: 500 })

		mockingoose(User).toReturn(user, 'save')

		const mock = jest.fn()

		try {
			await Create(user)
		} catch (error) {
			mock(error)
		}

		expect(mock).toBeCalledWith({
			code: 500,
		})
	})
})
