import jwt from 'jsonwebtoken'

import JWTVerify from '../JWTVerify'

jest.mock('jsonwebtoken')

describe('JWT verify', () => {
	const decoded = {
		foo: 'bar',
	}

	const secret = 'secret'

	const token = 'token'

	const verify = jest.spyOn(jwt, 'verify')

	it('Should verify jwt', async () => {
		expect.assertions(3)
		const mock = jest.fn()

		verify.mockImplementation(
			(tokenImplementation, secretImplementation, callback) => {
				callback(null, decoded)

				mock(tokenImplementation, secretImplementation)
			}
		)

		await JWTVerify(token, secret).then(decodedJWT => {
			expect(decodedJWT).toBe(decoded)
		})

		expect(mock).toHaveBeenCalledTimes(1)
		expect(mock).toBeCalledWith(token, secret)
	})

	it('Should failed', async () => {
		expect.assertions(3)

		const mock = jest.fn()
		const mock2 = jest.fn()

		verify.mockImplementation(
			(tokenImplementation, secretImplementation, callback) => {
				callback(new Error('error'), null)

				mock(tokenImplementation, secretImplementation)
			}
		)

		await JWTVerify(token, secret).catch(mock2)

		expect(mock).toHaveBeenCalledTimes(1)
		expect(mock).toBeCalledWith(token, secret)

		expect(mock2).toBeCalledWith(new Error('error'))
	})
})
