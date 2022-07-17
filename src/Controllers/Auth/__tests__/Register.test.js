import request from 'supertest'

import Create from '../../../Services/User/Create'
import FindByEmailOrUsername from '../../../Services/User/FindByEmailOrUsername'

import App from '../../../App'

jest.mock('../../../Services/User/Create')
jest.mock('../../../Services/User/FindByEmailOrUsername')

describe('Register', () => {
	afterEach(() => {
		jest.clearAllMocks()
		jest.restoreAllMocks()
		jest.resetModules()
	})

	it('Should success', async () => {
		const user = {
			username: 'testtest1234',
			name: 'Testtest1234',
			email: 'testtest1234@gmail.com',
			password: 'testtest1234',
		}

		Create.mockResolvedValueOnce({
			user: {
				_id: 'id',
			},
		})

		FindByEmailOrUsername.mockRejectedValueOnce({ code: 404 })

		const res = await request(App).post('/api/auth/register').send(user)

		expect(res.statusCode).toEqual(201)
		expect(res.body).toHaveProperty('data')
		expect(res.body).toEqual({
			success: true,
			data: {
				id: 'id',
			},
		})
	})

	it('Should fail with failed create user', async () => {
		const user = {
			username: 'testtest1234',
			name: 'Testtest1234',
			email: 'testtest1234@gmail.com',
			password: 'testtest1234',
		}

		Create.mockRejectedValueOnce({
			code: 500,
		})

		FindByEmailOrUsername.mockRejectedValueOnce({ code: 404 })

		const res = await request(App).post('/api/auth/register').send(user)

		expect(res.statusCode).toEqual(500)
		expect(res.body).toHaveProperty('error')
		expect(res.body).toEqual({
			success: false,
			error: 'Internal server error',
		})
	})

	it('Should fail with already exist email or username', async () => {
		const user = {
			username: 'testtest1234',
			name: 'Testtest1234',
			email: 'testtest1234@gmail.com',
			password: 'testtest1234',
		}

		Create.mockRejectedValueOnce({
			code: 500,
		})

		FindByEmailOrUsername.mockResolvedValueOnce({ user })

		const res = await request(App).post('/api/auth/register').send(user)

		expect(res.statusCode).toEqual(400)
		expect(res.body).toHaveProperty('errors')
		expect(res.body).toEqual({
			success: false,
			errors: [
				{
					location: 'body',
					msg: 'Username or email has already taken',
					param: 'email',
					value: user.email,
				},
			],
		})
	})
})
