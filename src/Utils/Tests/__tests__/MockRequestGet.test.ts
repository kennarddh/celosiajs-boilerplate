import MockRequestGet from '../MockRequestGet'

describe('Mock Request Get', () => {
	it('Should success', () => {
		expect.assertions(2)

		const mock = MockRequestGet([
			['key', 'correct'],
			['key2', 'correct2'],
		])

		expect(mock('key')).toEqual('correct')
		expect(mock('key2')).toEqual('correct2')
	})

	it('Should return null if not found', () => {
		expect.assertions(2)

		const mock = MockRequestGet([
			['key', 'correct'],
			['key2', 'correct2'],
		])

		expect(mock('key3')).toEqual(null)
		expect(mock('key4')).toEqual(null)
	})
})
