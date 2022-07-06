import JWTVerify from '../Utils/Promises/JWTVerify'

const VerifyJWT = async (req, res, next) => {
	const token = req.headers['x-access-token']?.split(' ')[1]

	if (!token)
		return res.status(401).json({
			success: false,
			error: 'Failed to authenticate',
		})

	await JWTVerify(token, process.env.JWT_SECRET)
		.then(decoded => {
			const user = {
				id: decoded.id,
				username: decoded.username,
			}

			req.user = user

			next()
		})
		.catch(() => {
			return res.status(401).json({
				success: false,
				error: 'Failed to authenticate',
			})
		})
}

export default VerifyJWT
