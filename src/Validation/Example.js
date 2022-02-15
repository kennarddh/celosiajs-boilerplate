import { body } from 'express-validator'

// Middleware
import CheckValidationError from '../Middlewares/CheckValidationError'

const Login = () => {
	const validator = [
		body('message').trim().not().isEmpty().bail().escape().bail(),
		CheckValidationError(),
	]

	return validator
}

export default Login
