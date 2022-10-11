import request from 'supertest'

import JWTSign from '../../../Utils/Promises/JWTSign'
import JWTVerify from '../../../Utils/Promises/JWTVerify'

import App from '../../../App'

jest.mock('../../../Utils/Promises/JWTSign')
jest.mock('../../../Utils/Promises/JWTVerify')

describe('Token', () => {
	afterEach(() => {
		jest.clearAllMocks()
		jest.restoreAllMocks()
		jest.resetModules()

		JWTSign.mockRestore()
		JWTVerify.mockRestore()
	})

	it('Should success', async () => {
		expect.assertions(7)

		const payload = {
			id: 'id',
		}

		JWTVerify.mockResolvedValueOnce(payload)

		JWTSign.mockResolvedValueOnce('token')
		JWTSign.mockResolvedValueOnce('refreshToken')

		const res = await request(App)
			.post('/api/auth/token')
			.set('Cookie', ['refreshToken=refreshToken'])

		expect(JWTVerify.mock.calls[0][0]).toBe('refreshToken')

		expect(JWTSign.mock.calls[0][0]).toStrictEqual(payload)
		expect(JWTSign.mock.calls[1][0]).toStrictEqual(payload)

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

	it('Should fail if jwt verify failed', async () => {
		expect.assertions(4)

		JWTVerify.mockRejectedValueOnce()

		JWTSign.mockResolvedValueOnce('token')
		JWTSign.mockResolvedValueOnce('refreshToken')

		const res = await request(App)
			.post('/api/auth/token')
			.set('Cookie', ['refreshToken=refreshToken'])

		expect(JWTVerify.mock.calls[0][0]).toBe('refreshToken')

		expect(res.statusCode).toEqual(401)
		expect(res.body).toHaveProperty('errors')
		expect(res.body).toEqual({
			data: {},
			errors: ['Failed to authenticate'],
		})
	})

	it('Should fail with no refresh token', async () => {
		expect.assertions(3)

		const payload = {
			id: 'id',
		}

		JWTVerify.mockResolvedValueOnce(payload)

		JWTSign.mockResolvedValueOnce('token')
		JWTSign.mockResolvedValueOnce('refreshToken')

		const res = await request(App).post('/api/auth/token')

		expect(res.statusCode).toEqual(400)
		expect(res.body).toHaveProperty('errors')
		expect(res.body).toEqual({
			data: {},
			errors: ['Refresh token is required'],
		})
	})

	it('Should fail if jwt sign token failed', async () => {
		expect.assertions(4)

		const payload = {
			id: 'id',
		}

		JWTVerify.mockResolvedValueOnce(payload)

		JWTSign.mockRejectedValueOnce()
		JWTSign.mockResolvedValueOnce('refreshToken')

		const res = await request(App)
			.post('/api/auth/token')
			.set('Cookie', ['refreshToken=refreshToken'])

		expect(JWTVerify.mock.calls[0][0]).toBe('refreshToken')

		expect(res.statusCode).toEqual(500)
		expect(res.body).toHaveProperty('errors')
		expect(res.body).toEqual({
			data: {},
			errors: ['Internal server error'],
		})
	})

	it('Should fail if jwt sign refresh token failed', async () => {
		expect.assertions(5)

		const payload = {
			id: 'id',
		}

		JWTVerify.mockResolvedValueOnce(payload)

		JWTSign.mockResolvedValueOnce('token')
		JWTSign.mockRejectedValueOnce()

		const res = await request(App)
			.post('/api/auth/token')
			.set('Cookie', ['refreshToken=refreshToken'])

		expect(JWTVerify.mock.calls[0][0]).toBe('refreshToken')

		expect(JWTSign.mock.calls[0][0]).toStrictEqual(payload)

		expect(res.statusCode).toEqual(500)
		expect(res.body).toHaveProperty('errors')
		expect(res.body).toEqual({
			data: {},
			errors: ['Internal server error'],
		})
	})
})
