import CreateUser from '../../Services/User/Create'

const Register = (req, res) => {
	const { username, name, email, password } = req.body

	CreateUser({ username, name, email, password })
		.then(({ user }) => {
			return res.status(201).json({
				success: true,
				data: {
					id: user._id,
				},
			})
		})
		.catch(({ code }) => {
			if (code === 500) {
				return res.status(500).json({
					success: false,
					error: 'Internal server error',
				})
			}
		})
}

export default Register
