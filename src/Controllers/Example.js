// Models
import Example from '../Models/Example'

// Utils
import RemoveSpecialCharacter from '../Utils/RemoveSpecialCharacter'

export const ExampleController = (req, res) => {
	const { body } = req

	const example = new Example({
		message: RemoveSpecialCharacter(body.message),
	})

	example
		.save()
		.then(() => {
			return res.status(200).json({
				success: true,
				message: 'Success saving example',
				data: {
					id: example.id,
					message: example.message,
				},
			})
		})
		.catch(() => {
			return res.status(500).json({
				success: false,
				error: 'Database save failed',
			})
		})
}
