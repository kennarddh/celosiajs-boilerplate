import { Types } from 'mongoose'

import request from 'supertest'

import App from 'App'

import JWTVerify from 'Utils/Promises/JWTVerify'

import FindById from 'Services/User/FindById'

jest.mock('Services/User/FindById')
jest.mock('Utils/Promises/JWTVerify')

interface IUser {
	_id: string | Types.ObjectId
	username: string
	name: string
	email: string
	password: string
}

const MockedJWTVerify = jest.mocked(JWTVerify)
const MockedFindById = jest.mocked(FindById)

describe('Get user data', () => {
	let user: IUser

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

		MockedFindById.mockRestore()
		MockedJWTVerify.mockRestore()
	})

	it('Should success', async () => {
		expect.assertions(5)

		const token = 'Bearer token'

		MockedJWTVerify.mockResolvedValueOnce({
			id: user._id,
			username: user.username,
		})

		MockedFindById.mockResolvedValueOnce({ user } as {
			user: Omit<IUser, '_id'> & { _id: Types.ObjectId }
		})

		const res = await request(App)
			.get('/api/v1/auth/user')
			.set('Access-Token', token)

		expect(MockedJWTVerify).toHaveBeenCalledWith('token', undefined)

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

		MockedJWTVerify.mockResolvedValueOnce({
			id: user._id,
			username: user.username,
		})

		MockedFindById.mockRejectedValueOnce({ code: 500 })

		const res = await request(App)
			.get('/api/v1/auth/user')
			.set('Access-Token', token)

		expect(MockedJWTVerify).toHaveBeenCalledWith('token', undefined)

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

		MockedJWTVerify.mockResolvedValueOnce({
			id: user._id,
			username: user.username,
		})

		MockedFindById.mockRejectedValueOnce({ code: 404 })

		const res = await request(App)
			.get('/api/v1/auth/user')
			.set('Access-Token', token)

		expect(MockedJWTVerify).toHaveBeenCalledWith('token', undefined)

		expect(FindById).toHaveBeenCalledWith({ id: user._id })

		expect(res.statusCode).toEqual(500)
		expect(res.body).toHaveProperty('errors')
		expect(res.body).toEqual({
			data: {},
			errors: ['Internal server error'],
		})
	})

	it('Should fail with no user', async () => {
		expect.assertions(3)

		const token = 'Bearer token'

		MockedJWTVerify.mockResolvedValueOnce(undefined as unknown as object)

		MockedFindById.mockRejectedValueOnce({ code: 404 })

		const res = await request(App)
			.get('/api/v1/auth/user')
			.set('Access-Token', token)

		expect(res.statusCode).toEqual(500)
		expect(res.body).toHaveProperty('errors')
		expect(res.body).toEqual({
			data: {},
			errors: ['Internal server error'],
		})
	})
})
