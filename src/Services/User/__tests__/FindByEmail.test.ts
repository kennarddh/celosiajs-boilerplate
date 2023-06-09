import mongoose from 'mongoose'

import MockMongoose, { ResetAll } from 'Utils/Tests/MockMongoose'

import User from 'Models/User'

import FindByEmail from '../FindByEmail'

describe('Find by email user service', () => {
	afterEach(() => {
		ResetAll()
	})

	it('Should get user', () => {
		expect.assertions(6)

		const user = {
			_id: new mongoose.Types.ObjectId('62c526bb503a77b155f6eba5'),
			username: 'username',
			name: 'Name',
			email: 'email@example.com',
			password: 'password',
		}

		MockMongoose(User).toReturnOnce(query => {
			expect(query.email).toBe('email@example.com')

			if (query.email === user.email) return user
		}, 'findOne')

		const findByIdPromise = FindByEmail({ email: user.email }).then(
			({ user: newUser }) => {
				expect(newUser._id).toBe(user._id)
				expect(newUser.email).toBe(user.email)
				expect(newUser.name).toBe(user.name)
				expect(newUser.password).toBe(user.password)
				expect(newUser.username).toBe(user.username)
			}
		)

		return findByIdPromise
	})

	it('Should reject with 404', async () => {
		expect.assertions(2)

		const user = {
			_id: new mongoose.Types.ObjectId('62c526bb503a77b155f6eba6'),
			username: 'username1',
			name: 'Name1',
			email: 'email1@example.com',
			password: 'password1',
		}

		MockMongoose(User).toReturnOnce(query => {
			expect(query.email).toBe('email2@example.com')

			if (query.email === user.email) return user
		}, 'findOne')

		const mock = jest.fn()

		try {
			await FindByEmail({ email: 'email2@example.com' })
		} catch (result) {
			mock((result as { code: number }).code)
		}

		expect(mock).toHaveBeenCalledWith(404)
	})

	it('Should reject with 500', async () => {
		expect.assertions(1)

		MockMongoose(User).toReturnOnce(new Error(), 'findOne')

		const mock = jest.fn()

		try {
			await FindByEmail({ email: 'email2@example.com' })
		} catch (result) {
			mock((result as { code: number }).code)
		}

		expect(mock).toHaveBeenCalledWith(500)
	})
})
