import jwt from 'jsonwebtoken'

import { JSONObject } from '@celosiajs/core'

const JWTSign = (payload: JSONObject, secret: jwt.Secret, option: jwt.SignOptions) =>
	new Promise<string>((resolve, reject) => {
		jwt.sign(payload, secret, option, (error: Error | null, token: string | undefined) => {
			if (error) return reject(error)

			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			resolve(token!)
		})
	})

export default JWTSign
