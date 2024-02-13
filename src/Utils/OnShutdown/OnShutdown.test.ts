import { Server } from 'http'

import Logger from 'Utils/Logger/Logger.js'

import Database from 'Database/index.js'

import OnShutdown from './OnShutdown.js'

jest.mock<typeof import('Utils/Logger/Logger.js')>('Utils/Logger/Logger.js')
jest.mock<typeof import('Database/index.js')>('Database/index.js')

describe('On shutdown', () => {
	afterEach(() => {
		jest.clearAllMocks()
		jest.restoreAllMocks()
		jest.resetModules()
	})

	it('Should success', async () => {
		expect.assertions(8)

		const loggerSpy = jest.spyOn(Logger, 'info')
		const databaseSpy = jest.spyOn(Database, 'close')
		const processSpy = jest.spyOn(process, 'exit')

		databaseSpy.mockResolvedValue()

		const close = jest.fn()
		const exit = jest.fn()

		processSpy.mockImplementation((code?: number) => {
			exit(code)
			return undefined as never
		})

		await OnShutdown(
			{
				close: callback => {
					callback?.()
					close()
				},
			} as Server,
			8080,
			'SIGINT',
		)()

		expect(processSpy).toHaveBeenCalledTimes(1)
		expect(processSpy).toHaveBeenCalledWith(0)

		expect(loggerSpy).toHaveBeenCalledTimes(3)
		expect(loggerSpy.mock.calls[0]?.[0]).toBe(
			'SIGINT signal received: Stopping server',
		)
		expect(loggerSpy.mock.calls[1]?.[0]).toBe('Server Stopped')
		expect(loggerSpy.mock.calls[2]?.[0]).toBe('Database connection closed')

		expect(databaseSpy).toHaveBeenCalledTimes(1)
		expect(databaseSpy.mock.calls[0]?.[0]).toBe(false)
	})

	it('Should success with string port', async () => {
		expect.assertions(8)

		const loggerSpy = jest.spyOn(Logger, 'info')
		const databaseSpy = jest.spyOn(Database, 'close')
		const processSpy = jest.spyOn(process, 'exit')

		databaseSpy.mockResolvedValue()

		const close = jest.fn()
		const exit = jest.fn()

		processSpy.mockImplementation((code?: number) => {
			exit(code)
			return undefined as never
		})

		await OnShutdown(
			{
				close: callback => {
					callback?.()
					close()
				},
			} as Server,
			'8080',
			'SIGINT',
		)()

		expect(processSpy).toHaveBeenCalledTimes(1)
		expect(processSpy).toHaveBeenCalledWith(0)

		expect(loggerSpy).toHaveBeenCalledTimes(3)
		expect(loggerSpy.mock.calls[0]?.[0]).toBe(
			'SIGINT signal received: Stopping server',
		)
		expect(loggerSpy.mock.calls[1]?.[0]).toBe('Server Stopped')
		expect(loggerSpy.mock.calls[2]?.[0]).toBe('Database connection closed')

		expect(databaseSpy).toHaveBeenCalledTimes(1)
		expect(databaseSpy.mock.calls[0]?.[0]).toBe(false)
	})
})
