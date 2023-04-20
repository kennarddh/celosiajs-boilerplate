import { Server } from 'http'

import OnShutdown from './OnShutdown'

import Logger from '../Logger/Logger'
import Database from '../../Database'

jest.mock<typeof import('../Logger/Logger')>('../Logger/Logger')
jest.mock<typeof import('../../Database')>('../../Database')

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
			'SIGINT'
		)()

		expect(processSpy).toHaveBeenCalledTimes(1)
		expect(processSpy).toHaveBeenCalledWith(0)

		expect(loggerSpy).toHaveBeenCalledTimes(3)
		expect(loggerSpy.mock.calls[0]?.[0]).toBe(
			'SIGINT signal received: Stopping server'
		)
		expect(loggerSpy.mock.calls[1]?.[0]).toBe('Server Stopped')
		expect(loggerSpy.mock.calls[2]?.[0]).toBe('Database connection closed')

		expect(databaseSpy).toHaveBeenCalledTimes(1)
		expect(databaseSpy.mock.calls[0]?.[0]).toBe(false)
	})
})
