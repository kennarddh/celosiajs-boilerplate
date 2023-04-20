const MockRequestGet = (pair: [string, string | string[]][]) =>
	jest.fn().mockImplementation((keyInput: string) => {
		const result = pair.find(([key]) => key === keyInput)

		if (!result) return null

		return result[1]
	})

export default MockRequestGet
