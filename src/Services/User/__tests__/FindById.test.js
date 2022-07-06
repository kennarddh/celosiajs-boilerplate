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
})
