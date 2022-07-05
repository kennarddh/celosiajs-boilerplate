import * as mockingoose from 'mockingoose'

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

		mockingoose(User, 'save').toReturn(user)

		const createPromise = Create(user).then(({ user: newUser }) => {
			expect(newUser.username).toBe(user.username)
			expect(newUser.name).toBe(user.name)
			expect(newUser.email).toBe(user.email)
		})

		return createPromise
	})
})
