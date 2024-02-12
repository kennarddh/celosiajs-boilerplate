import jwt from 'jsonwebtoken'

import JWTSign from '../JWTSign'

jest.mock('jsonwebtoken')

describe('JWT sign', () => {
	const payload = {
		foo: 'bar',
	}

	const secret = 'secret'

	const options = {
		expiresIn: 10,
	}

	const sign = jest.spyOn(jwt, 'sign')

	it('Should sign jwt', async () => {
		expect.assertions(3)
		const mock = jest.fn()

		sign.mockImplementation(
			(
				payloadImplementation,
				secretImplementation,
				optionsImplementation,
				callback,
			) => {
				callback(null, 'token')

				mock(
					payloadImplementation,
					secretImplementation,
					optionsImplementation,
				)
			},
		)

		await JWTSign(payload, secret, options).then(resolveToken => {
			expect(resolveToken).toBe('token')
		})

		expect(mock).toHaveBeenCalledTimes(1)
		expect(mock).toHaveBeenCalledWith(payload, secret, options)
	})

	it('Should failed', async () => {
		expect.assertions(3)

		const mock = jest.fn()
		const mock2 = jest.fn()

		sign.mockImplementation(
			(
				payloadImplementation,
				secretImplementation,
				optionsImplementation,
				callback,
			) => {
				callback(new Error('error'), undefined)

				mock(
					payloadImplementation,
					secretImplementation,
					optionsImplementation,
				)
			},
		)

		await JWTSign(payload, secret, options).catch(mock2)

		expect(mock).toHaveBeenCalledTimes(1)
		expect(mock).toHaveBeenCalledWith(payload, secret, options)

		expect(mock2).toHaveBeenCalledWith(new Error('error'))
	})
})
