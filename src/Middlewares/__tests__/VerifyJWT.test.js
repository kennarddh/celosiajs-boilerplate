import JWTVerify from '../../Utils/Promises/JWTVerify'

import VerifyJWT from '../VerifyJWT'

const user = {
	id: 'id',
	username: 'username',
}

jest.mock('../../Utils/Promises/JWTVerify', () => ({
	__esModule: true,
	default: jest.fn().mockResolvedValue(user),
}))

describe('Verify JWT middleware', () => {
	const nextFunction = jest.fn()
	const jsonFunction = jest.fn()
	const statusFunction = jest.fn(() => ({
		json: jsonFunction,
	}))

	let mockRequest
	let mockResponse

	beforeEach(() => {
		mockRequest = {}
		mockResponse = {
			status: statusFunction,
		}
	})

	it('Should success', async () => {
		expect.assertions(3)
		mockRequest = {
			headers: {
				'x-access-token':
					'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyYzQ1N2RmNjhhZDc0NTRjNTRhNWFjOSIsInVzZXJuYW1lIjoidGVzdHRlc3QxMiIsImlhdCI6MTY1NzEwMTIzMSwiZXhwIjoxNjU3MTg3NjMxfQ.-YlQ95KUSFaxGZLvTlQLkAEkXBLHmSqzIeJspzSw5vM',
			},
		}

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
		expect.assertions(4)
		mockRequest = {
			headers: {
				'x-access-token':
					'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyYzQ1N2RmNjhhZDc0NTRjNTRhNWFjOSIsInVzZXJuYW1lIjoidGVzdHRlc3QxMiIsImlhdCI6MTY1NzEwMTIzMSwiZXhwIjoxNjU3MTg3NjMxfQ.-YlQ95KUSFaxGZLvTlQLkAEkXBLHmSqzIeJspzSw5vM',
			},
		}

		JWTVerify.mockRejectedValueOnce({
			success: false,
			error: 'Failed to authenticate',
		})

		const promise = new Promise((_, reject) => {
			VerifyJWT(mockRequest, mockResponse, () => {
				nextFunction()

				reject()
			})
		})

		const mock = jest.fn()

		try {
			await promise()
		} catch {
			mock()
		}

		expect(mock).toHaveBeenCalled()
		expect(nextFunction).toHaveBeenCalled()

		expect(jsonFunction.mock.calls[0][0]).toEqual({
			success: false,
			error: 'Failed to authenticate',
		})

		expect(statusFunction.mock.calls[0][0]).toBe(401)
	})

	it.todo('Should failed with invalid header')

	it.todo('Should failed without header')
})
