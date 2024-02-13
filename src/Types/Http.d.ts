export interface IUser {
	id: number
}

declare global {
	namespace Express {
		interface Request {
			user?: IUser
		}
	}
}
