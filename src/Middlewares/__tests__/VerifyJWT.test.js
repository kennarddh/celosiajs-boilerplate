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

	it.todo('Should failed with invalid token')

	it.todo('Should failed with invalid header')

	it.todo('Should failed without header')
})
