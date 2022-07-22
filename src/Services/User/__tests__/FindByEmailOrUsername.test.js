import * as mockingoose from 'mockingoose'

import mongoose from 'mongoose'

import FindByEmailOrUsername from '../FindByEmailOrUsername'

// Models
import User from '../../../Models/User'

describe('Find by email or username user service', () => {
	afterEach(() => {
		mockingoose.resetAll()
	})

	it('Should get user', () => {
		expect.assertions(7)

		const user = {
			_id: mongoose.Types.ObjectId('62c526bb503a77b155f6eba5'),
			username: 'username',
			name: 'Name',
			email: 'email@example.com',
			password: 'password',
		}

		mockingoose(User).toReturn(query => {
			expect(query.getQuery().$or[0].email).toBe(user.email)
			expect(query.getQuery().$or[1].username).toBe(user.username)

			if (
				query.getQuery().$or[0].email === user.email ||
				query.getQuery().$or[1].username === user.username
			)
				return user
		}, 'findOne')

		const findByEmailOrUsernamePromise = FindByEmailOrUsername({
			email: user.email,
			username: user.username,
		}).then(({ user: newUser }) => {
			expect(newUser._id).toBe(user._id)
			expect(newUser.email).toBe(user.email)
			expect(newUser.name).toBe(user.name)
			expect(newUser.password).toBe(user.password)
			expect(newUser.username).toBe(user.username)
		})

		return findByEmailOrUsernamePromise
	})

	it('Should reject with 404', async () => {
		expect.assertions(3)

		const user = {
			_id: mongoose.Types.ObjectId('62c526bb503a77b155f6eba6'),
			username: 'username1',
			name: 'Name1',
			email: 'email1@example.com',
			password: 'password1',
		}

		mockingoose(User).toReturn(query => {
			expect(query.getQuery().$or[0].email).toBe('email2@example.com')
			expect(query.getQuery().$or[1].username).toBe('username2')

			if (
				query.getQuery().$or[0].email === user.email ||
				query.getQuery().$or[1].username === user.username
			)
				return user
		}, 'findOne')

		const mock = jest.fn()

		try {
			await FindByEmailOrUsername({
				email: 'email2@example.com',
				username: 'username2',
			})
		} catch ({ code }) {
			mock(code)
		}

		expect(mock).toHaveBeenCalledWith(404)
	})
})
