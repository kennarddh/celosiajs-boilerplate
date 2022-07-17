import * as mockingoose from 'mockingoose'

import mongoose from 'mongoose'

import FindByEmail from '../FindByEmail'

// Models
import User from '../../../Models/User'

describe('Find by email user service', () => {
	afterEach(() => {
		mockingoose.resetAll()
	})

	it('Should get user', () => {
		expect.assertions(6)

		const user = {
			_id: mongoose.Types.ObjectId('62c526bb503a77b155f6eba5'),
			username: 'username',
			name: 'Name',
			email: 'email@example.com',
			password: 'password',
		}

		mockingoose(User).toReturn(query => {
			expect(query.getQuery()).toMatchSnapshot(
				'findByEmailOrUsernameQuery'
			)

			if (
				query.getQuery().email === user.email ||
				query.getQuery().username === user.username
			)
				return user
		}, 'findOne')

		const findByEmailOrUsernamePromise = FindByEmail({
			email: user.email,
			username: user.username,
		}).then(({ user: newUser }) => {
			expect(newUser).toMatchSnapshot('findByEmailOrUsernameResult')

			expect(newUser.username).toBe(user.username)
			expect(newUser.name).toBe(user.name)
			expect(newUser.email).toBe(user.email)
			expect(newUser._id).toBe(user._id)
		})

		return findByEmailOrUsernamePromise
	})
})
