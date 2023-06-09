import bcrypt from 'bcrypt'

import MockMongoose, { ResetAll } from 'Utils/Tests/MockMongoose'

import User from 'Models/User'

import Create from '../Create'

describe('Create user service', () => {
	afterEach(() => {
		ResetAll()
	})

	it('Should create new user', () => {
		expect.assertions(4)

		const user = {
			username: 'username',
			name: 'Name',
			email: 'email@example.com',
			password: 'password',
		}

		const hash = jest.spyOn(bcrypt, 'hash')

		hash.mockImplementationOnce(() => Promise.resolve('passwordHash'))

		MockMongoose(User).toReturnOnce(user, 'save')

		const createPromise = Create(user).then(({ user: newUser }) => {
			expect(newUser.username).toBe(user.username)
			expect(newUser.name).toBe(user.name)
			expect(newUser.email).toBe(user.email)
			expect(newUser.password).toBe('passwordHash')
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

		hash.mockImplementationOnce(() => Promise.reject({ code: 500 }))

		MockMongoose(User).toReturnOnce(user, 'save')

		const mock = jest.fn()

		try {
			await Create(user)
		} catch (error) {
			mock(error)
		}

		expect(mock).toHaveBeenCalledWith({
			code: 500,
		})
	})

	it('Should failed if save failed', async () => {
		expect.assertions(1)

		const user = {
			username: 'username',
			name: 'Name',
			email: 'email@example.com',
			password: 'password',
		}

		const hash = jest.spyOn(bcrypt, 'hash')

		hash.mockImplementationOnce(() => Promise.resolve('passwordHash'))

		MockMongoose(User).toReturnOnce(new Error(), 'save')

		const mock = jest.fn()

		try {
			await Create(user)
		} catch (error) {
			mock(error)
		}

		expect(mock).toHaveBeenCalledWith({
			code: 500,
		})
	})
})
