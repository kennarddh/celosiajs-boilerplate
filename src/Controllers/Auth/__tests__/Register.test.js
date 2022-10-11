import request from 'supertest'

import Create from '../../../Services/User/Create'
import FindByEmailOrUsername from '../../../Services/User/FindByEmailOrUsername'

import App from '../../../App'

jest.mock('../../../Services/User/Create')
jest.mock('../../../Services/User/FindByEmailOrUsername')

describe('Register', () => {
	let user

	beforeEach(() => {
		user = {
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

		Create.mockRestore()
		FindByEmailOrUsername.mockRestore()
	})

	it('Should success', async () => {
		expect.assertions(3)

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
			errors: [],
			data: {
				id: 'id',
			},
		})
	})

	it('Should fail with failed create user', async () => {
		expect.assertions(3)

		Create.mockRejectedValueOnce({
			code: 500,
		})

		FindByEmailOrUsername.mockRejectedValueOnce({ code: 404 })

		const res = await request(App).post('/api/auth/register').send(user)

		expect(res.statusCode).toEqual(500)
		expect(res.body).toHaveProperty('errors')
		expect(res.body).toEqual({
			data: {},
			errors: ['Internal server error'],
		})
	})

	it('Should fail with already exist email or username', async () => {
		expect.assertions(3)

		Create.mockRejectedValueOnce({
			code: 500,
		})

		FindByEmailOrUsername.mockResolvedValueOnce({ user })

		const res = await request(App).post('/api/auth/register').send(user)

		expect(res.statusCode).toEqual(400)
		expect(res.body).toHaveProperty('errors')
		expect(res.body).toEqual({
			data: {},
			errors: ['Username or email has already taken'],
		})
	})

	it('Should fail with password whitespace validation', async () => {
		expect.assertions(3)

		user.password = 'test test1234'

		Create.mockRejectedValueOnce({
			code: 500,
		})

		FindByEmailOrUsername.mockRejectedValueOnce({ code: 404 })

		const res = await request(App).post('/api/auth/register').send(user)

		expect(res.statusCode).toEqual(400)
		expect(res.body).toHaveProperty('errors')
		expect(res.body).toEqual({
			data: {},
			errors: ['Password cannot have whitespace'],
		})
	})

	it('Should fail with invalid username validation', async () => {
		expect.assertions(3)

		user.username = 'testtest1234testtest1234testtest1234testtest1234'

		Create.mockRejectedValueOnce({
			code: 500,
		})

		FindByEmailOrUsername.mockRejectedValueOnce({ code: 404 })

		const res = await request(App).post('/api/auth/register').send(user)

		expect(res.statusCode).toEqual(400)
		expect(res.body).toHaveProperty('errors')
		expect(res.body).toEqual({
			data: {},
			errors: ['Username must be a maximum of 32 characters'],
		})
	})

	it('Should fail with invalid name validation', async () => {
		expect.assertions(3)

		user.name = 'Testtest1234testtest1234testtest1234testtest1234'

		Create.mockRejectedValueOnce({
			code: 500,
		})

		FindByEmailOrUsername.mockRejectedValueOnce({ code: 404 })

		const res = await request(App).post('/api/auth/register').send(user)

		expect(res.statusCode).toEqual(400)
		expect(res.body).toHaveProperty('errors')
		expect(res.body).toEqual({
			data: {},
			errors: ['Name must be a maximum of 32 characters'],
		})
	})

	it('Should fail with invalid email validation', async () => {
		expect.assertions(3)

		user.email = 'testtest1234@ gmail.com'

		Create.mockRejectedValueOnce({
			code: 500,
		})

		FindByEmailOrUsername.mockRejectedValueOnce({ code: 404 })

		const res = await request(App).post('/api/auth/register').send(user)

		expect(res.statusCode).toEqual(400)
		expect(res.body).toHaveProperty('errors')
		expect(res.body).toEqual({
			data: {},
			errors: ['Invalid email'],
		})
	})

	it('Should fail with invalid password validation', async () => {
		expect.assertions(3)

		user.password = 'test'

		Create.mockRejectedValueOnce({
			code: 500,
		})

		FindByEmailOrUsername.mockRejectedValueOnce({ code: 404 })

		const res = await request(App).post('/api/auth/register').send(user)

		expect(res.statusCode).toEqual(400)
		expect(res.body).toHaveProperty('errors')
		expect(res.body).toEqual({
			data: {},
			errors: [
				'Password must be a minimum of 8 characters and a maximum of 32 characters',
			],
		})
	})

	it('Should fail with invalid find user by email or username 500 validation', async () => {
		expect.assertions(3)

		Create.mockRejectedValueOnce({
			code: 500,
		})

		FindByEmailOrUsername.mockRejectedValueOnce({ code: 500 })

		const res = await request(App).post('/api/auth/register').send(user)

		expect(res.statusCode).toEqual(400)
		expect(res.body).toHaveProperty('errors')
		expect(res.body).toEqual({
			data: {},
			errors: ['Internal Server Error'],
		})
	})
})
