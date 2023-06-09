import IsValidObjectId from '../IsValidObjectId'

describe('Is valid object id', () => {
	it('Should success', () => {
		expect.assertions(2)

		expect(IsValidObjectId('5e63c3a5e4232e4cd0274ac2')).toBe(true)
		expect(IsValidObjectId('5e63c3a5e4232e4cd0274ac3')).toBe(true)
	})

	it('Should throw', () => {
		expect.assertions(2)

		expect(IsValidObjectId('wrong id')).toBe(false)
		expect(IsValidObjectId('wrong id 2')).toBe(false)
	})
})
