import IsValidObjectIdExpressValidator from '../IsValidObjectIdExpressValidator'

describe('Is valid object id', () => {
	it('Should success', () => {
		expect.assertions(2)

		const validator = IsValidObjectIdExpressValidator()

		expect(validator('5e63c3a5e4232e4cd0274ac2')).toBe(true)
		expect(validator('5e63c3a5e4232e4cd0274ac3')).toBe(true)
	})

	it('Should throw', () => {
		expect.assertions(2)

		const validator = IsValidObjectIdExpressValidator('id2')

		expect(() => validator('wrong id')).toThrow(new Error('Invalid id2'))
		expect(() => validator('wrong id 2')).toThrow(new Error('Invalid id2'))
	})
})
