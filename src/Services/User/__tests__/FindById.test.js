import * as mockingoose from 'mockingoose'

import mongoose from 'mongoose'

import FindById from '../FindById'

// Models
import User from '../../../Models/User'

describe('Create user service', () => {
	afterEach(() => {
		mockingoose.resetAll()
	})

	it('Should create new user', () => {
		expect.assertions(6)

		const user = {
			_id: mongoose.Types.ObjectId('62c526bb503a77b155f6eba5'),
			username: 'username',
			name: 'Name',
			email: 'email@example.com',
			password: 'password',
		}

		mockingoose(User).toReturn(query => {
			expect(query.getQuery()).toMatchSnapshot('findByIdQuery')

			if (query.getQuery()._id === user._id) return user
		}, 'findOne')

		const findByIdPromise = FindById({ id: user._id }).then(
			({ user: newUser }) => {
				expect(newUser).toMatchSnapshot('findByIdResult')

				expect(newUser.username).toBe(user.username)
				expect(newUser.name).toBe(user.name)
				expect(newUser.email).toBe(user.email)
				expect(newUser._id).toBe(user._id)
			}
		)

		return findByIdPromise
	})

	it('Should reject with 404', async () => {
		expect.assertions(2)

		const user = {
			_id: mongoose.Types.ObjectId('62c526bb503a77b155f6eba6'),
			username: 'username1',
			name: 'Name1',
			email: 'email1@example.com',
			password: 'password1',
		}

		mockingoose(User).toReturn(query => {
			expect(query.getQuery()).toMatchSnapshot('findById404Query')

			if (query.getQuery()._id === user._id) return user
		}, 'findOne')

		const mock = jest.fn()

		try {
			await FindById({
				id: mongoose.Types.ObjectId('62c526bb503a77b155f6eba5'),
			})
		} catch ({ code }) {
			mock(code)
		}

		expect(mock).toHaveBeenCalledWith(404)
	})
})
