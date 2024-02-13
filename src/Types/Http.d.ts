export interface IUser {
	id: number
}

export interface IUserJWTPayload {
	id: number
}

declare global {
	namespace Express {
		interface Request {
			user?: IUser
		}
	}
}
