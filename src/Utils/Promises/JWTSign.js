import jwt from 'jsonwebtoken'

const JWTSign = (payload, secret, option) =>
	new Promise((resolve, reject) => {
		jwt.sign(payload, secret, option, (error, token) => {
			if (error) return reject(error)

			resolve(token)
		})
	})

export default JWTSign
