import jwt from 'jsonwebtoken'

import { JSONObject } from 'Internals'

const JWTSign = <T extends JSONObject>(payload: T, secret: jwt.Secret, option: jwt.SignOptions) =>
	new Promise<string>((resolve, reject) => {
		jwt.sign(payload, secret, option, (error: Error | null, token: string | undefined) => {
			if (error) {
				reject(error)

				return
			}

			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			resolve(token!)
		})
	})

export default JWTSign
