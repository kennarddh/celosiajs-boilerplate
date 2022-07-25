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
		jest.restoreAllMocks()
		jest.resetModules()

		FindByEmail.mockRestore()
		JWTSign.mockRestore()

		bcrypt.compare.mockRestore()
	})

	it('Should success', async () => {
		expect.assertions(3)
		FindByEmail.mockResolvedValueOnce({
			user: {
				password: 'testtest',
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

	it('Should fail with failed jwt sign', async () => {
		FindByEmail.mockResolvedValueOnce({
			user: {
				password: 'testtest',
				_id: 'id',
				username: 'testtest',
			},
		})

		bcrypt.compare.mockResolvedValueOnce(true)

		JWTSign.mockRejectedValueOnce('error')

		const res = await request(App).post('/api/auth/login').send({
			email: 'test@test.com',
			password: 'testtest',
		})

		expect(res.statusCode).toEqual(500)
		expect(res.body).toHaveProperty('error')
		expect(res.body).toEqual({
			success: false,
			error: 'Internal server error',
		})
	})

	it('Should fail with invalid password', async () => {
		expect.assertions(3)
		FindByEmail.mockResolvedValueOnce({
			user: {
				password: 'testtest2',
				_id: 'id',
				username: 'testtest',
			},
		})

		bcrypt.compare.mockResolvedValueOnce(false)

		JWTSign.mockResolvedValueOnce('token')

		const res = await request(App).post('/api/auth/login').send({
			email: 'test@test.com',
			password: 'testtest',
		})

		expect(res.statusCode).toEqual(403)
		expect(res.body).toHaveProperty('error')
		expect(res.body).toEqual({
			success: false,
			error: 'Invalid email or password',
		})
	})

	it('Should fail with invalid email', async () => {
		expect.assertions(3)
		FindByEmail.mockRejectedValueOnce({ code: 404 })

		bcrypt.compare.mockResolvedValueOnce(false)

		JWTSign.mockResolvedValueOnce('token')

		const res = await request(App).post('/api/auth/login').send({
			email: 'test@test.com',
			password: 'testtest',
		})

		expect(res.statusCode).toEqual(403)
		expect(res.body).toHaveProperty('error')
		expect(res.body).toEqual({
			success: false,
			error: 'Invalid email or password',
		})
	})

	it('Should fail internal server error', async () => {
		expect.assertions(3)
		FindByEmail.mockRejectedValueOnce({ code: 500 })

		bcrypt.compare.mockResolvedValueOnce(false)

		JWTSign.mockResolvedValueOnce('token')

		const res = await request(App).post('/api/auth/login').send({
			email: 'test@test.com',
			password: 'testtest',
		})

		expect(res.statusCode).toEqual(500)
		expect(res.body).toHaveProperty('error')
		expect(res.body).toEqual({
			success: false,
			error: 'Internal server error',
		})
	})

	it('Should fail with failed bcrypt', async () => {
		FindByEmail.mockResolvedValueOnce({
			user: {
				password: 'testtest',
				_id: 'id',
				username: 'testtest',
			},
		})

		bcrypt.compare.mockRejectedValueOnce('error')

		JWTSign.mockResolvedValueOnce('token')

		const res = await request(App).post('/api/auth/login').send({
			email: 'test@test.com',
			password: 'testtest',
		})

		expect(res.statusCode).toEqual(500)
		expect(res.body).toHaveProperty('error')
		expect(res.body).toEqual({
			success: false,
			error: 'Internal server error',
		})
	})

	it('Should fail with invalid password validation', async () => {
		expect.assertions(3)
		FindByEmail.mockResolvedValueOnce({
			user: {
				password: 'testtest',
				_id: 'id',
				username: 'testtest',
			},
		})

		bcrypt.compare.mockResolvedValueOnce(true)

		JWTSign.mockResolvedValueOnce('token')

		const res = await request(App).post('/api/auth/login').send({
			email: 'test@test.com',
			password: 'test',
		})

		expect(res.statusCode).toEqual(400)
		expect(res.body).toHaveProperty('errors')
		expect(res.body).toEqual({
			errors: [
				{
					location: 'body',
					msg: 'Invalid value',
					param: 'password',
					value: 'test',
				},
			],
			success: false,
		})
	})

	it('Should fail with invalid email validation', async () => {
		expect.assertions(3)
		FindByEmail.mockResolvedValueOnce({
			user: {
				password: 'testtest',
				_id: 'id',
				username: 'testtest',
			},
		})

		bcrypt.compare.mockResolvedValueOnce(true)

		JWTSign.mockResolvedValueOnce('token')

		const res = await request(App).post('/api/auth/login').send({
			email: 'test',
			password: 'testtest',
		})

		expect(res.statusCode).toEqual(400)
		expect(res.body).toHaveProperty('errors')
		expect(res.body).toEqual({
			errors: [
				{
					location: 'body',
					msg: 'Invalid value',
					param: 'email',
					value: 'test',
				},
			],
			success: false,
		})
	})

	it('Should fail with invalid email and password validation', async () => {
		expect.assertions(3)
		FindByEmail.mockResolvedValueOnce({
			user: {
				password: 'testtest',
				_id: 'id',
				username: 'testtest',
			},
		})

		bcrypt.compare.mockResolvedValueOnce(true)

		JWTSign.mockResolvedValueOnce('token')

		const res = await request(App).post('/api/auth/login').send({
			email: 'test',
			password: 'test',
		})

		expect(res.statusCode).toEqual(400)
		expect(res.body).toHaveProperty('errors')
		expect(res.body).toEqual({
			errors: [
				{
					location: 'body',
					msg: 'Invalid value',
					param: 'email',
					value: 'test',
				},
				{
					location: 'body',
					msg: 'Invalid value',
					param: 'password',
					value: 'test',
				},
			],
			success: false,
		})
	})

	it('Should fail with password whitespace validation', async () => {
		expect.assertions(3)
		FindByEmail.mockResolvedValueOnce({
			user: {
				password: 'testtest',
				_id: 'id',
				username: 'testtest',
			},
		})

		bcrypt.compare.mockResolvedValueOnce(true)

		JWTSign.mockResolvedValueOnce('token')

		const res = await request(App).post('/api/auth/login').send({
			email: 'test@test.com',
			password: 'test test',
		})

		expect(res.statusCode).toEqual(400)
		expect(res.body).toHaveProperty('errors')
		expect(res.body).toEqual({
			errors: [
				{
					location: 'body',
					msg: 'Password cannot have whitespace',
					param: 'password',
					value: 'test test',
				},
			],
			success: false,
		})
	})
})
