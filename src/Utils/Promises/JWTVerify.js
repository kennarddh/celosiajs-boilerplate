import jwt from 'jsonwebtoken'

const JWTVerify = (token, secret) =>
	new Promise((resolve, reject) => {
		jwt.verify(token, secret, (error, decoded) => {
			if (error) return reject(error)

			resolve(decoded)
		})
	})

export default JWTVerify
