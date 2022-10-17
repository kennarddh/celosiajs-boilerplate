import { JWTPayload } from './JWT'

declare global {
	namespace Express {
		interface Request {
			user?: JWTPayload
		}
	}
}
