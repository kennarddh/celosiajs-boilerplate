import request from 'supertest'

import FindById from '../../../Services/User/FindById'
import JWTVerify from '../../../Utils/Promises/JWTVerify'

import App from '../../../App'

jest.mock('../../../Services/User/FindById')
jest.mock('../../../Utils/Promises/JWTVerify')

describe('Get user data', () => {
	let user

	beforeEach(() => {
		user = {
			_id: '1234',
			username: 'testtest1234',
			name: 'Testtest1234',
			email: 'testtest1234@gmail.com',
			password: 'testtest1234',
		}
	})

	afterEach(() => {
		jest.clearAllMocks()
		jest.restoreAllMocks()
		jest.resetModules()

		FindById.mockRestore()
		JWTVerify.mockRestore()
	})

	it('Should success', async () => {
		expect.assertions(5)

		const token = 'Bearer token'

		JWTVerify.mockResolvedValueOnce({
			id: user._id,
			username: user.username,
		})

		FindById.mockResolvedValueOnce({ user })

		const res = await request(App)
			.get('/api/auth/user')
			.set('x-access-token', token)

		expect(JWTVerify).toHaveBeenCalledWith('token', undefined)

		expect(FindById).toHaveBeenCalledWith({ id: user._id })

		expect(res.statusCode).toEqual(200)
		expect(res.body).toHaveProperty('data')
		expect(res.body).toEqual({
			errors: [],
			data: {
				id: user._id,
				username: user.username,
				name: user.name,
				email: user.email,
			},
		})
	})

	it('Should fail with code 500 FindById', async () => {
		expect.assertions(5)

		const token = 'Bearer token'

		JWTVerify.mockResolvedValueOnce({
			id: user._id,
			username: user.username,
		})

		FindById.mockRejectedValueOnce({ code: 500 })

		const res = await request(App)
			.get('/api/auth/user')
			.set('x-access-token', token)

		expect(JWTVerify).toHaveBeenCalledWith('token', undefined)

		expect(FindById).toHaveBeenCalledWith({ id: user._id })

		expect(res.statusCode).toEqual(500)
		expect(res.body).toHaveProperty('errors')
		expect(res.body).toEqual({
			data: {},
			errors: ['Internal server error'],
		})
	})

	it('Should fail with code 404 FindById', async () => {
		expect.assertions(5)

		const token = 'Bearer token'

		JWTVerify.mockResolvedValueOnce({
			id: user._id,
			username: user.username,
		})

		FindById.mockRejectedValueOnce({ code: 404 })

		const res = await request(App)
			.get('/api/auth/user')
			.set('x-access-token', token)

		expect(JWTVerify).toHaveBeenCalledWith('token', undefined)

		expect(FindById).toHaveBeenCalledWith({ id: user._id })

		expect(res.statusCode).toEqual(500)
		expect(res.body).toHaveProperty('errors')
		expect(res.body).toEqual({
			data: {},
			errors: ['Internal server error'],
		})
	})
})
