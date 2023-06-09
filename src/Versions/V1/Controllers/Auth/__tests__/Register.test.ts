import { Types } from 'mongoose'

import request from 'supertest'

import App from 'App'

import Create from 'Services/User/Create'
import FindByEmailOrUsername from 'Services/User/FindByEmailOrUsername'

jest.mock('Services/User/Create')
jest.mock('Services/User/FindByEmailOrUsername')

const MockedCreate = jest.mocked(Create)
const MockedFindByEmailOrUsername = jest.mocked(FindByEmailOrUsername)

interface IUser {
	_id: string | Types.ObjectId
	username: string
	name: string
	email: string
	password: string
}

describe('Register', () => {
	let user: IUser

	beforeEach(() => {
		user = {
			_id: 'id',
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

		MockedCreate.mockRestore()
		MockedFindByEmailOrUsername.mockRestore()
	})

	it('Should success', async () => {
		expect.assertions(3)

		MockedCreate.mockResolvedValueOnce({
			user: {
				_id: 'id' as unknown as Types.ObjectId,
				username: 'testtest1234',
				name: 'Testtest1234',
				email: 'testtest1234@gmail.com',
				password: 'testtest1234',
			},
		})

		MockedFindByEmailOrUsername.mockRejectedValueOnce({ code: 404 })

		const res = await request(App).post('/api/v1/auth/register').send(user)

		expect(res.statusCode).toEqual(201)
		expect(res.body).toHaveProperty('data')
		expect(res.body).toEqual({
			errors: [],
			data: {
				id: 'id',
			},
		})
	})

	it('Should fail with failed MockedCreate user', async () => {
		expect.assertions(3)

		MockedCreate.mockRejectedValueOnce({
			code: 500,
		})

		MockedFindByEmailOrUsername.mockRejectedValueOnce({ code: 404 })

		const res = await request(App).post('/api/v1/auth/register').send(user)

		expect(res.statusCode).toEqual(500)
		expect(res.body).toHaveProperty('errors')
		expect(res.body).toEqual({
			data: {},
			errors: ['Internal server error'],
		})
	})

	it('Should fail with already exist email or username', async () => {
		expect.assertions(3)

		MockedCreate.mockRejectedValueOnce({
			code: 500,
		})

		MockedFindByEmailOrUsername.mockResolvedValueOnce({ user } as {
			user: Omit<IUser, '_id'> & { _id: Types.ObjectId }
		})

		const res = await request(App).post('/api/v1/auth/register').send(user)

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

		MockedCreate.mockRejectedValueOnce({
			code: 500,
		})

		MockedFindByEmailOrUsername.mockRejectedValueOnce({ code: 404 })

		const res = await request(App).post('/api/v1/auth/register').send(user)

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

		MockedCreate.mockRejectedValueOnce({
			code: 500,
		})

		MockedFindByEmailOrUsername.mockRejectedValueOnce({ code: 404 })

		const res = await request(App).post('/api/v1/auth/register').send(user)

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

		MockedCreate.mockRejectedValueOnce({
			code: 500,
		})

		MockedFindByEmailOrUsername.mockRejectedValueOnce({ code: 404 })

		const res = await request(App).post('/api/v1/auth/register').send(user)

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

		MockedCreate.mockRejectedValueOnce({
			code: 500,
		})

		MockedFindByEmailOrUsername.mockRejectedValueOnce({ code: 404 })

		const res = await request(App).post('/api/v1/auth/register').send(user)

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

		MockedCreate.mockRejectedValueOnce({
			code: 500,
		})

		MockedFindByEmailOrUsername.mockRejectedValueOnce({ code: 404 })

		const res = await request(App).post('/api/v1/auth/register').send(user)

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

		MockedCreate.mockRejectedValueOnce({
			code: 500,
		})

		MockedFindByEmailOrUsername.mockRejectedValueOnce({ code: 500 })

		const res = await request(App).post('/api/v1/auth/register').send(user)

		expect(res.statusCode).toEqual(400)
		expect(res.body).toHaveProperty('errors')
		expect(res.body).toEqual({
			data: {},
			errors: ['Internal Server Error'],
		})
	})
})
