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
	})

	it('Should success', async () => {
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

	it('Should fail with password whitespace validation', async () => {
		user.password = 'test test1234'

		Create.mockRejectedValueOnce({
			code: 500,
		})

		FindByEmailOrUsername.mockRejectedValueOnce({ code: 404 })

		const res = await request(App).post('/api/auth/register').send(user)

		expect(res.statusCode).toEqual(400)
		expect(res.body).toHaveProperty('errors')
		expect(res.body).toEqual({
			success: false,
			errors: [
				{
					location: 'body',
					msg: 'Password cannot have whitespace',
					param: 'password',
					value: user.password,
				},
			],
		})
	})

	it('Should fail with invalid username validation', async () => {
		user.username = 'testtest1234testtest1234testtest1234testtest1234'

		Create.mockRejectedValueOnce({
			code: 500,
		})

		FindByEmailOrUsername.mockRejectedValueOnce({ code: 404 })

		const res = await request(App).post('/api/auth/register').send(user)

		expect(res.statusCode).toEqual(400)
		expect(res.body).toHaveProperty('errors')
		expect(res.body).toEqual({
			success: false,
			errors: [
				{
					location: 'body',
					msg: 'Invalid value',
					param: 'username',
					value: user.username,
				},
			],
		})
	})

	it('Should fail with invalid name validation', async () => {
		user.name = 'Testtest1234testtest1234testtest1234testtest1234'

		Create.mockRejectedValueOnce({
			code: 500,
		})

		FindByEmailOrUsername.mockRejectedValueOnce({ code: 404 })

		const res = await request(App).post('/api/auth/register').send(user)

		expect(res.statusCode).toEqual(400)
		expect(res.body).toHaveProperty('errors')
		expect(res.body).toEqual({
			success: false,
			errors: [
				{
					location: 'body',
					msg: 'Invalid value',
					param: 'name',
					value: user.name,
				},
			],
		})
	})

	it('Should fail with invalid email validation', async () => {
		user.email = 'testtest1234@ gmail.com'

		Create.mockRejectedValueOnce({
			code: 500,
		})

		FindByEmailOrUsername.mockRejectedValueOnce({ code: 404 })

		const res = await request(App).post('/api/auth/register').send(user)

		expect(res.statusCode).toEqual(400)
		expect(res.body).toHaveProperty('errors')
		expect(res.body).toEqual({
			success: false,
			errors: [
				{
					location: 'body',
					msg: 'Invalid value',
					param: 'email',
					value: user.email,
				},
			],
		})
	})

	it('Should fail with invalid password validation', async () => {
		user.password = 'test'

		Create.mockRejectedValueOnce({
			code: 500,
		})

		FindByEmailOrUsername.mockRejectedValueOnce({ code: 404 })

		const res = await request(App).post('/api/auth/register').send(user)

		expect(res.statusCode).toEqual(400)
		expect(res.body).toHaveProperty('errors')
		expect(res.body).toEqual({
			success: false,
			errors: [
				{
					location: 'body',
					msg: 'Invalid value',
					param: 'password',
					value: user.password,
				},
			],
		})
	})
})
