import { NextFunction, Request, Response } from 'express'

import JWTVerify from 'Utils/Promises/JWTVerify'
import MockRequestGet from 'Utils/Tests/MockRequestGet'

import VerifyJWT from '../VerifyJWT'

jest.mock('Utils/Promises/JWTVerify')

const MockedJWTVerify = jest.mocked(JWTVerify)

describe('Verify JWT middleware', () => {
	const nextFunction: NextFunction = jest.fn()
	const jsonFunction = jest.fn()
	const statusFunction = jest.fn()

	let mockRequest: Partial<Request>

	let mockResponse: Partial<Response>

	beforeEach(() => {
		mockRequest = {}

		mockResponse = {
			status: statusFunction.mockReturnThis(),
			json: jsonFunction.mockReturnThis(),
		}
	})

	afterEach(() => {
		jest.clearAllMocks()

		MockedJWTVerify.mockRestore()
	})

	it('Should success', async () => {
		expect.assertions(2)

		mockRequest = {
			get: MockRequestGet([
				[
					'Access-Token',
					'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyYzQ1N2RmNjhhZDc0NTRjNTRhNWFjOSIsInVzZXJuYW1lIjoidGVzdHRlc3QxMiIsImlhdCI6MTY1NzEwMTIzMSwiZXhwIjoxNjU3MTg3NjMxfQ.-YlQ95KUSFaxGZLvTlQLkAEkXBLHmSqzIeJspzSw5vM',
				],
			]),
		}

		const user = {
			id: 'id',
		}

		MockedJWTVerify.mockResolvedValueOnce(user)

		const promise = new Promise(resolve => {
			VerifyJWT(
				mockRequest as unknown as Request,
				mockResponse as unknown as Response,
				() => {
					nextFunction()

					resolve(true)
				},
			)
		}).then(() => {
			expect(nextFunction).toHaveBeenCalled()

			expect(mockRequest?.user?.id).toBe(user.id)
		})

		return promise
	})

	it('Should fail with invalid token', async () => {
		expect.assertions(2)

		mockRequest = {
			get: MockRequestGet([
				[
					'Access-Token',
					'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyYzQ1N2RmNjhhZDc0NTRjNTRhNWFjOSIsInVzZXJuYW1lIjoidGVzdHRlc3QxMiIsImlhdCI6MTY1NzEwMTIzMSwiZXhwIjoxNjU3MTg3NjMxfQ.-YlQ95KUSFaxGZLvTlQLkAEkXBLHmSqzIeJspzSw5vM',
				],
			]),
		}

		MockedJWTVerify.mockRejectedValueOnce(new Error())

		await VerifyJWT(
			mockRequest as unknown as Request,
			mockResponse as unknown as Response,
			nextFunction,
		)

		expect(statusFunction.mock.calls[0][0]).toBe(401)

		expect(jsonFunction.mock.calls[0][0]).toEqual({
			data: {},
			errors: ['Failed to authenticate'],
		})
	})

	it('Should fail with invalid header', async () => {
		expect.assertions(2)

		mockRequest = {
			get: MockRequestGet([
				[
					'Access-Token',
					'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyYzQ1N2RmNjhhZDc0NTRjNTRhNWFjOSIsInVzZXJuYW1lIjoidGVzdHRlc3QxMiIsImlhdCI6MTY1NzEwMTIzMSwiZXhwIjoxNjU3MTg3NjMxfQ.-YlQ95KUSFaxGZLvTlQLkAEkXBLHmSqzIeJspzSw5vM',
				],
			]),
		}

		await VerifyJWT(
			mockRequest as unknown as Request,
			mockResponse as unknown as Response,
			nextFunction,
		)

		expect(statusFunction.mock.calls[0][0]).toBe(401)

		expect(jsonFunction.mock.calls[0][0]).toEqual({
			data: {},
			errors: ['Failed to authenticate'],
		})
	})

	it('Should fail without header', async () => {
		expect.assertions(2)

		mockRequest = {
			get: MockRequestGet([]),
		}

		await VerifyJWT(
			mockRequest as unknown as Request,
			mockResponse as unknown as Response,
			nextFunction,
		)

		expect(statusFunction.mock.calls[0][0]).toBe(401)

		expect(jsonFunction.mock.calls[0][0]).toEqual({
			data: {},
			errors: ['Failed to authenticate'],
		})
	})

	it('Should fail with array header', async () => {
		expect.assertions(2)

		mockRequest = {
			get: MockRequestGet([
				[
					'Access-Token',
					[
						'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyYzQ1N2RmNjhhZDc0NTRjNTRhNWFjOSIsInVzZXJuYW1lIjoidGVzdHRlc3QxMiIsImlhdCI6MTY1NzEwMTIzMSwiZXhwIjoxNjU3MTg3NjMxfQ.-YlQ95KUSFaxGZLvTlQLkAEkXBLHmSqzIeJspzSw5vM',
						'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyYzQ1N2RmNjhhZDc0NTRjNTRhNWFjOSIsInVzZXJuYW1lIjoidGVzdHRlc3QxMiIsImlhdCI6MTY1NzEwMTIzMSwiZXhwIjoxNjU3MTg3NjMxfQ.-YlQ95KUSFaxGZLvTlQLkAEkXBLHmSqzIeJspzSw5vM',
					],
				],
			]),
		}

		await VerifyJWT(
			mockRequest as unknown as Request,
			mockResponse as unknown as Response,
			nextFunction,
		)

		expect(statusFunction.mock.calls[0][0]).toBe(401)

		expect(jsonFunction.mock.calls[0][0]).toEqual({
			data: {},
			errors: ['Failed to authenticate'],
		})
	})
})
