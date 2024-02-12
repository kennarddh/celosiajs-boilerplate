import bcrypt from 'bcrypt'

import { Types } from 'mongoose'

import request from 'supertest'

import App from 'App'

import JWTSign from 'Utils/Promises/JWTSign'

import FindByEmail from 'Services/User/FindByEmail'

jest.mock('bcrypt')
jest.mock('Services/User/FindByEmail')
jest.mock('Utils/Promises/JWTSign')

const MockedJWTSign = jest.mocked(JWTSign)
const MockedFindByEmail = jest.mocked(FindByEmail)
const MockedBcryptCompare = jest.mocked(bcrypt.compare)

describe('Login', () => {
	afterEach(() => {
		jest.clearAllMocks()
		jest.restoreAllMocks()
		jest.resetModules()

		MockedFindByEmail.mockRestore()
		MockedJWTSign.mockRestore()

		MockedBcryptCompare.mockRestore()
	})

	it('Should success', async () => {
		expect.assertions(3)

		MockedFindByEmail.mockResolvedValueOnce({
			user: {
				name: 'testtest',
				email: 'email@provider.com',
				password: 'testtest',
				_id: 'id' as unknown as Types.ObjectId,
				username: 'testtest',
			},
		})

		MockedBcryptCompare.mockImplementationOnce(() => Promise.resolve(true))

		MockedJWTSign.mockResolvedValueOnce('token')
		MockedJWTSign.mockResolvedValueOnce('refreshToken')

		const res = await request(App).post('/api/v1/auth/login').send({
			email: 'test@test.com',
			password: 'testtest',
		})

		expect(res.statusCode).toEqual(200)
		expect(res.body).toHaveProperty('data')
		expect(res.body).toEqual({
			errors: [],
			data: {
				token: `Bearer token`,
			},
		})
	})

	it('Should set refresh token cookie', async () => {
		expect.assertions(4)

		MockedFindByEmail.mockResolvedValueOnce({
			user: {
				name: 'testtest',
				email: 'email@provider.com',
				password: 'testtest',
				_id: 'id' as unknown as Types.ObjectId,
				username: 'testtest',
			},
		})

		MockedBcryptCompare.mockImplementationOnce(() => Promise.resolve(true))

		MockedJWTSign.mockResolvedValueOnce('token')
		MockedJWTSign.mockResolvedValueOnce('refreshToken')

		const res = await request(App).post('/api/v1/auth/login').send({
			email: 'test@test.com',
			password: 'testtest',
		})

		expect(res.statusCode).toEqual(200)
		expect(res.body).toHaveProperty('data')
		expect(res.body).toEqual({
			errors: [],
			data: {
				token: `Bearer token`,
			},
		})

		expect(res.header['set-cookie']).toEqual([
			'refreshToken=refreshToken; Path=/; HttpOnly; SameSite=Lax',
		])
	})

	it('Should fail with failed jwt sign', async () => {
		expect.assertions(3)

		MockedFindByEmail.mockResolvedValueOnce({
			user: {
				name: 'testtest',
				email: 'email@provider.com',
				password: 'testtest',
				_id: 'id' as unknown as Types.ObjectId,
				username: 'testtest',
			},
		})

		MockedBcryptCompare.mockImplementationOnce(() => Promise.resolve(true))

		MockedJWTSign.mockRejectedValueOnce('error')

		const res = await request(App).post('/api/v1/auth/login').send({
			email: 'test@test.com',
			password: 'testtest',
		})

		expect(res.statusCode).toEqual(500)
		expect(res.body).toHaveProperty('errors')
		expect(res.body).toEqual({
			data: {},
			errors: ['Internal server error'],
		})
	})

	it('Should fail with failed refresh token jwt sign', async () => {
		expect.assertions(3)

		MockedFindByEmail.mockResolvedValueOnce({
			user: {
				name: 'testtest',
				email: 'email@provider.com',
				password: 'testtest',
				_id: 'id' as unknown as Types.ObjectId,
				username: 'testtest',
			},
		})

		MockedBcryptCompare.mockImplementationOnce(() => Promise.resolve(true))

		MockedJWTSign.mockResolvedValueOnce('token')
		MockedJWTSign.mockRejectedValueOnce('error')

		const res = await request(App).post('/api/v1/auth/login').send({
			email: 'test@test.com',
			password: 'testtest',
		})

		expect(res.statusCode).toEqual(500)
		expect(res.body).toHaveProperty('errors')
		expect(res.body).toEqual({
			data: {},
			errors: ['Internal server error'],
		})
	})

	it('Should fail with invalid password', async () => {
		expect.assertions(3)

		MockedFindByEmail.mockResolvedValueOnce({
			user: {
				name: 'testtest',
				email: 'email@provider.com',
				password: 'testtest2',
				_id: 'id' as unknown as Types.ObjectId,
				username: 'testtest',
			},
		})

		MockedBcryptCompare.mockImplementationOnce(() => Promise.resolve(false))

		MockedJWTSign.mockResolvedValueOnce('token')

		const res = await request(App).post('/api/v1/auth/login').send({
			email: 'test@test.com',
			password: 'testtest',
		})

		expect(res.statusCode).toEqual(403)
		expect(res.body).toHaveProperty('errors')
		expect(res.body).toEqual({
			data: {},
			errors: ['Invalid email or password'],
		})
	})

	it('Should fail with invalid email', async () => {
		expect.assertions(3)

		MockedFindByEmail.mockRejectedValueOnce({ code: 404 })

		MockedBcryptCompare.mockImplementationOnce(() => Promise.resolve(false))

		MockedJWTSign.mockResolvedValueOnce('token')

		const res = await request(App).post('/api/v1/auth/login').send({
			email: 'test@test.com',
			password: 'testtest',
		})

		expect(res.statusCode).toEqual(403)
		expect(res.body).toHaveProperty('errors')
		expect(res.body).toEqual({
			data: {},
			errors: ['Invalid email or password'],
		})
	})

	it('Should fail internal server error', async () => {
		expect.assertions(3)

		MockedFindByEmail.mockRejectedValueOnce({ code: 500 })

		MockedBcryptCompare.mockImplementationOnce(() => Promise.resolve(false))

		MockedJWTSign.mockResolvedValueOnce('token')

		const res = await request(App).post('/api/v1/auth/login').send({
			email: 'test@test.com',
			password: 'testtest',
		})

		expect(res.statusCode).toEqual(500)
		expect(res.body).toHaveProperty('errors')
		expect(res.body).toEqual({
			data: {},
			errors: ['Internal server error'],
		})
	})

	it('Should fail with failed bcrypt', async () => {
		MockedFindByEmail.mockResolvedValueOnce({
			user: {
				name: 'testtest',
				email: 'email@provider.com',
				password: 'testtest',
				_id: 'id' as unknown as Types.ObjectId,
				username: 'testtest',
			},
		})

		MockedBcryptCompare.mockImplementationOnce(() =>
			Promise.reject(new Error('error')),
		)

		MockedJWTSign.mockResolvedValueOnce('token')

		const res = await request(App).post('/api/v1/auth/login').send({
			email: 'test@test.com',
			password: 'testtest',
		})

		expect(res.statusCode).toEqual(500)
		expect(res.body).toHaveProperty('errors')
		expect(res.body).toEqual({
			data: {},
			errors: ['Internal server error'],
		})
	})

	it('Should fail with invalid password validation', async () => {
		expect.assertions(3)

		MockedFindByEmail.mockResolvedValueOnce({
			user: {
				name: 'testtest',
				email: 'email@provider.com',
				password: 'testtest',
				_id: 'id' as unknown as Types.ObjectId,
				username: 'testtest',
			},
		})

		MockedBcryptCompare.mockImplementationOnce(() => Promise.resolve(true))

		MockedJWTSign.mockResolvedValueOnce('token')

		const res = await request(App).post('/api/v1/auth/login').send({
			email: 'test@test.com',
			password: 'test',
		})

		expect(res.statusCode).toEqual(400)
		expect(res.body).toHaveProperty('errors')
		expect(res.body).toEqual({
			errors: [
				'Password must be a minimum of 8 characters and a maximum of 32 characters',
			],
			data: {},
		})
	})

	it('Should fail with invalid email validation', async () => {
		expect.assertions(3)

		MockedFindByEmail.mockResolvedValueOnce({
			user: {
				name: 'testtest',
				email: 'email@provider.com',
				password: 'testtest',
				_id: 'id' as unknown as Types.ObjectId,
				username: 'testtest',
			},
		})

		MockedBcryptCompare.mockImplementationOnce(() => Promise.resolve(true))

		MockedJWTSign.mockResolvedValueOnce('token')

		const res = await request(App).post('/api/v1/auth/login').send({
			email: 'test',
			password: 'testtest',
		})

		expect(res.statusCode).toEqual(400)
		expect(res.body).toHaveProperty('errors')
		expect(res.body).toEqual({
			errors: ['Invalid email'],
			data: {},
		})
	})

	it('Should fail with invalid email and password validation', async () => {
		expect.assertions(3)

		MockedFindByEmail.mockResolvedValueOnce({
			user: {
				name: 'testtest',
				email: 'email@provider.com',
				password: 'testtest',
				_id: 'id' as unknown as Types.ObjectId,
				username: 'testtest',
			},
		})

		MockedBcryptCompare.mockImplementationOnce(() => Promise.resolve(true))

		MockedJWTSign.mockResolvedValueOnce('token')

		const res = await request(App).post('/api/v1/auth/login').send({
			email: 'test',
			password: 'test',
		})

		expect(res.statusCode).toEqual(400)
		expect(res.body).toHaveProperty('errors')
		expect(res.body).toEqual({
			errors: [
				'Invalid email',
				'Password must be a minimum of 8 characters and a maximum of 32 characters',
			],
			data: {},
		})
	})

	it('Should fail with password whitespace validation', async () => {
		expect.assertions(3)

		MockedFindByEmail.mockResolvedValueOnce({
			user: {
				name: 'testtest',
				email: 'email@provider.com',
				password: 'testtest',
				_id: 'id' as unknown as Types.ObjectId,
				username: 'testtest',
			},
		})

		MockedBcryptCompare.mockImplementationOnce(() => Promise.resolve(true))

		MockedJWTSign.mockResolvedValueOnce('token')

		const res = await request(App).post('/api/v1/auth/login').send({
			email: 'test@test.com',
			password: 'test test',
		})

		expect(res.statusCode).toEqual(400)
		expect(res.body).toHaveProperty('errors')
		expect(res.body).toEqual({
			errors: ['Password cannot have whitespace'],
			data: {},
		})
	})
})
