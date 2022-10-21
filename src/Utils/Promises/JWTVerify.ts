import jwt from 'jsonwebtoken'

const JWTVerify = <T extends object>(token: string, secret: jwt.Secret) =>
	new Promise<T>((resolve, reject) => {
		jwt.verify(token, secret, (error, decoded) => {
			if (error) return reject(error)

			resolve(decoded as T)
		})
	})

export default JWTVerify
