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
})
