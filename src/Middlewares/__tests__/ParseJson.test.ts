import express, { NextFunction, Request, Response } from 'express'

import ParseJson from '../ParseJson'

describe('Parse json middleware', () => {
	afterEach(() => {
		jest.clearAllMocks()
		jest.restoreAllMocks()
		jest.resetModules()
	})

	it('Should success', () => {
		expect.assertions(3)

		const expressSpy = jest.spyOn(express, 'json')

		const mock = jest.fn()

		const nextFunction: NextFunction = jest.fn()
		const jsonFunction = jest.fn()
		const statusFunction = jest.fn()

		expressSpy.mockImplementation(() => (_, _2, errorHandler) => {
			mock()
			errorHandler()
		})

		ParseJson(
			{} as unknown as Request,
			{
				status: statusFunction.mockReturnThis(),
				json: jsonFunction.mockReturnThis(),
			} as unknown as Response,
			nextFunction,
		)

		expect(mock).toHaveBeenCalled()
		expect(jsonFunction).not.toHaveBeenCalled()
		expect(nextFunction).toHaveBeenCalled()
	})

	it('Should fail', () => {
		expect.assertions(3)

		const expressSpy = jest.spyOn(express, 'json')

		const mock = jest.fn()

		const nextFunction: NextFunction = jest.fn()
		const jsonFunction = jest.fn()
		const statusFunction = jest.fn()

		expressSpy.mockImplementation(() => (_, _2, errorHandler) => {
			mock()
			errorHandler(new Error(''))
		})

		ParseJson(
			{} as unknown as Request,
			{
				status: statusFunction.mockReturnThis(),
				json: jsonFunction.mockReturnThis(),
			} as unknown as Response,
			nextFunction,
		)

		expect(mock).toHaveBeenCalled()
		expect(jsonFunction.mock.calls[0]?.[0]).toStrictEqual({
			errors: ['Invalid json'],
			data: {},
		})
		expect(nextFunction).not.toHaveBeenCalled()
	})
})
