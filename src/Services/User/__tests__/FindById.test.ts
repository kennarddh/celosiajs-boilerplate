import mongoose from 'mongoose'

import MockMongoose, { ResetAll } from 'Utils/Tests/MockMongoose'

import User from 'Models/User'

import FindById from '../FindById'

describe('Find by id user service', () => {
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

		MockMongoose(User).toReturn(query => {
			expect(query._id).toBe(user._id)

			if (query._id === user._id) return user
		}, 'findOne')

		const findByIdPromise = FindById({ id: user._id }).then(
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

		MockMongoose(User).toReturn(query => {
			expect(query._id).toEqual(
				new mongoose.Types.ObjectId('62c526bb503a77b155f6eba5')
			)

			if (query._id === user._id) return user
		}, 'findOne')

		const mock = jest.fn()

		try {
			await FindById({
				id: new mongoose.Types.ObjectId('62c526bb503a77b155f6eba5'),
			})
		} catch (result) {
			mock((result as { code: number }).code)
		}

		expect(mock).toHaveBeenCalledWith(404)
	})

	it('Should reject with 500', async () => {
		expect.assertions(1)

		MockMongoose(User).toReturn(new Error(), 'findOne')

		const mock = jest.fn()

		try {
			await FindById({
				id: new mongoose.Types.ObjectId('62c526bb503a77b155f6eba5'),
			})
		} catch (result) {
			mock((result as { code: number }).code)
		}

		expect(mock).toHaveBeenCalledWith(500)
	})
})
