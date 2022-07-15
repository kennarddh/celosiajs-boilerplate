import bcrypt from 'bcrypt'

import request from 'supertest'

import FindByEmail from '../../../Services/User/FindByEmail'

import JWTSign from '../../../Utils/Promises/JWTSign'

import App from '../../../App'

jest.mock('bcrypt')
jest.mock('../../../Services/User/FindByEmail')
jest.mock('../../../Utils/Promises/JWTSign')

describe('Login', () => {
	afterEach(() => {
		jest.clearAllMocks()
	})

	it('Should success', async () => {
		expect.assertions(3)
		FindByEmail.mockResolvedValueOnce({
			user: {
				password: 'test',
				_id: 'id',
				username: 'testtest',
			},
		})

		bcrypt.compare.mockResolvedValueOnce(true)

		JWTSign.mockResolvedValueOnce('token')

		const res = await request(App).post('/api/auth/login').send({
			email: 'test@test.com',
			password: 'testtest',
		})

		expect(res.statusCode).toEqual(200)
		expect(res.body).toHaveProperty('data')
		expect(res.body).toEqual({
			success: true,
			data: {
				token: `Bearer token`,
			},
		})
	})
})
