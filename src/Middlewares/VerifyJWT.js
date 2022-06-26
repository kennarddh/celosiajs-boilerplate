import jwt from 'jsonwebtoken'

const VerifyJWT = (req, res, next) => {
	const token = req.headers['x-access-token']?.split(' ')[1]

	if (!token)
		return res.status(401).json({
			success: false,
			error: 'Failed to authenticate',
		})

	jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
		if (error)
			return res.status(401).json({
				success: false,
				error: 'Failed to authenticate',
			})

		const user = {
			id: decoded.id,
			username: decoded.username,
		}

		req.user = user

		next()
	})
}

export default VerifyJWT
