import { NextFunction, Request } from 'express'

describe('Cors middleware', () => {
	const oldEnv = process.env

	afterEach(() => {
		jest.clearAllMocks()
		jest.restoreAllMocks()
		jest.resetModules()
	})

	beforeEach(() => {
		jest.resetModules() // Most important - it clears the cache
		process.env = { ...oldEnv } // Make a copy
	})

	afterAll(() => {
		process.env = oldEnv // Restore old environment
	})

	it('Should success because cors origin is included', async () => {
		expect.assertions(3)

		process.env.CORS_ORIGIN = 'a,b'

		const mock = jest.fn()

		jest.mock('cors', () => ({
			...jest.requireActual('cors'),
			__esModule: true,
			default: jest.fn(({ origin }) => {
				origin('a', mock)
				return () => null
			}),
		}))

		const corsImport = await import('../Cors')
		const corsFn = corsImport.default

		corsFn(
			{} as unknown as Request,
			{
				setHeader() {
					throw new Error('Function not implemented.')
				},
				end() {
					throw new Error('Function not implemented.')
				},
			},
			jest.fn() as NextFunction,
		)

		expect(mock).toHaveBeenCalled()
		expect(mock.mock.calls[0]?.[0]).toBeNull()
		expect(mock.mock.calls[0]?.[1]).toBe(true)
	})

	it('Should fail because cors origin is not included', async () => {
		expect.assertions(3)

		process.env.CORS_ORIGIN = 'a,b'

		const mock = jest.fn()

		jest.mock('cors', () => ({
			...jest.requireActual('cors'),
			__esModule: true,
			default: jest.fn(({ origin }) => {
				origin('c', mock)
				return () => null
			}),
		}))

		const corsImport = await import('../Cors')
		const corsFn = corsImport.default

		corsFn(
			{} as unknown as Request,
			{
				setHeader() {
					throw new Error('Function not implemented.')
				},
				end() {
					throw new Error('Function not implemented.')
				},
			},
			jest.fn() as NextFunction,
		)

		expect(mock).toHaveBeenCalled()
		expect(mock.mock.calls[0]?.[0]).toBeNull()
		expect(mock.mock.calls[0]?.[1]).toBe(false)
	})
})
