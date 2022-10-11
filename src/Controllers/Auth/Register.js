import CreateUser from '../../Services/User/Create'

const Register = (req, res) => {
	const { username, name, email, password } = req.body

	CreateUser({ username, name, email, password })
		.then(({ user }) => {
			return res.status(201).json({
				errors: [],
				data: {
					id: user._id,
				},
			})
		})
		.catch(() => {
			return res.status(500).json({
				errors: ['Internal server error'],
				data: {},
			})
		})
}

export default Register
