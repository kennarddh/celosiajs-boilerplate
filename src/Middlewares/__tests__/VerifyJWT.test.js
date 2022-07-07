import JWTVerify from '../../Utils/Promises/JWTVerify'

import VerifyJWT from '../VerifyJWT'

jest.mock('../../Utils/Promises/JWTVerify')

describe('Verify JWT middleware', () => {
	const nextFunction = jest.fn()
	const jsonFunction = jest.fn()
	const statusFunction = jest.fn()

	let mockRequest

	let mockResponse

	beforeEach(() => {
		mockRequest = {}

		mockResponse = {
			status: statusFunction.mockReturnThis(),
			json: jsonFunction.mockReturnThis(),
		}
	})

	afterEach(() => {
		jest.clearAllMocks()
	})

	it('Should success', async () => {
		expect.assertions(3)

		mockRequest = {
			headers: {
				'x-access-token':
					'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyYzQ1N2RmNjhhZDc0NTRjNTRhNWFjOSIsInVzZXJuYW1lIjoidGVzdHRlc3QxMiIsImlhdCI6MTY1NzEwMTIzMSwiZXhwIjoxNjU3MTg3NjMxfQ.-YlQ95KUSFaxGZLvTlQLkAEkXBLHmSqzIeJspzSw5vM',
			},
		}

		const user = {
			id: 'id',
			username: 'username',
		}

		JWTVerify.mockResolvedValueOnce(user)

		const promise = new Promise(resolve => {
			VerifyJWT(mockRequest, mockResponse, () => {
				nextFunction()

				resolve()
			})
		}).then(() => {
			expect(nextFunction).toHaveBeenCalled()

			expect(mockRequest.user.id).toBe(user.id)
			expect(mockRequest.user.username).toBe(user.username)
		})

		return promise
	})

	it('Should failed with invalid token', async () => {
		expect.assertions(2)

		mockRequest = {
			headers: {
				'x-access-token':
					'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyYzQ1N2RmNjhhZDc0NTRjNTRhNWFjOSIsInVzZXJuYW1lIjoidGVzdHRlc3QxMiIsImlhdCI6MTY1NzEwMTIzMSwiZXhwIjoxNjU3MTg3NjMxfQ.-YlQ95KUSFaxGZLvTlQLkAEkXBLHmSqzIeJspzSw5vM',
			},
		}

		JWTVerify.mockRejectedValueOnce()

		await VerifyJWT(mockRequest, mockResponse)

		expect(statusFunction.mock.calls[0][0]).toBe(401)

		expect(jsonFunction.mock.calls[0][0]).toEqual({
			success: false,
			error: 'Failed to authenticate',
		})
	})

	it('Should failed with invalid header', async () => {
		expect.assertions(2)

		mockRequest = {
			headers: {
				'x-access-token':
					'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyYzQ1N2RmNjhhZDc0NTRjNTRhNWFjOSIsInVzZXJuYW1lIjoidGVzdHRlc3QxMiIsImlhdCI6MTY1NzEwMTIzMSwiZXhwIjoxNjU3MTg3NjMxfQ.-YlQ95KUSFaxGZLvTlQLkAEkXBLHmSqzIeJspzSw5vM',
			},
		}

		await VerifyJWT(mockRequest, mockResponse)

		expect(statusFunction.mock.calls[0][0]).toBe(401)

		expect(jsonFunction.mock.calls[0][0]).toEqual({
			success: false,
			error: 'Failed to authenticate',
		})
	})

	it('Should failed without header', async () => {
		expect.assertions(2)

		mockRequest = {
			headers: {},
		}

		await VerifyJWT(mockRequest, mockResponse)

		expect(statusFunction.mock.calls[0][0]).toBe(401)

		expect(jsonFunction.mock.calls[0][0]).toEqual({
			success: false,
			error: 'Failed to authenticate',
		})
	})
})
