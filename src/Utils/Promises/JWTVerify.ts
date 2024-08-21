import jwt from 'jsonwebtoken'

import { JSONObject } from '@celosiajs/core'

const JWTVerify = <T extends JSONObject>(token: string, secret: jwt.Secret) =>
	new Promise<T>((resolve, reject) => {
		jwt.verify(token, secret, (error, decoded) => {
			if (error) return reject(error)

			resolve(decoded as T)
		})
	})

export default JWTVerify
