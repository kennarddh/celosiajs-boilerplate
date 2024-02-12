import jwt, {
	JsonWebTokenError,
	JwtPayload,
	VerifyCallback,
} from 'jsonwebtoken'

import JWTVerify from '../JWTVerify'

jest.mock('jsonwebtoken')

const MockedVerify = jest.mocked(jwt.verify)

interface IDecoded {
	foo: string
}

describe('JWT verify', () => {
	afterAll(() => {
		jest.clearAllMocks()
		jest.restoreAllMocks()
		jest.resetModules()

		MockedVerify.mockRestore()
	})

	const decoded: IDecoded = {
		foo: 'bar',
	}

	const secret = 'secret'

	const token = 'token'

	it('Should verify jwt', async () => {
		expect.assertions(3)

		const mock = jest.fn()

		MockedVerify.mockImplementationOnce(
			(tokenImplementation, secretImplementation, callback) => {
				const callback2 = callback as VerifyCallback<JwtPayload>

				callback2(null, decoded)

				mock(tokenImplementation, secretImplementation)
			},
		)

		await JWTVerify<IDecoded>(token, secret).then(decodedJWT => {
			expect(decodedJWT).toBe(decoded)
		})

		expect(mock).toHaveBeenCalledTimes(1)
		expect(mock).toHaveBeenCalledWith(token, secret)
	})

	it('Should failed', async () => {
		expect.assertions(3)

		const mock = jest.fn()
		const mock2 = jest.fn()

		MockedVerify.mockImplementationOnce(
			(tokenImplementation, secretImplementation, callback) => {
				const callback2 = callback as VerifyCallback<JwtPayload>

				callback2('error' as unknown as JsonWebTokenError, undefined)

				mock(tokenImplementation, secretImplementation)
			},
		)

		await JWTVerify<IDecoded>(token, secret).catch(mock2)

		expect(mock).toHaveBeenCalledTimes(1)
		expect(mock).toHaveBeenCalledWith(token, secret)

		expect(mock2.mock.calls[0][0]).toBe('error')
	})
})
