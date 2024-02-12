import jwt from 'jsonwebtoken'

const JWTSign = <T extends object>(
	payload: T,
	secret: jwt.Secret,
	option: jwt.SignOptions,
) =>
	new Promise<string | undefined>((resolve, reject) => {
		jwt.sign(
			payload,
			secret,
			option,
			(error: Error | null, token: string | undefined) => {
				if (error) return reject(error)

				resolve(token)
			},
		)
	})

export default JWTSign
