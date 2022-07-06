module.exports = {
	testEnvironment: 'node',
	coveragePathIgnorePatterns: [
		'/node_modules/',
		'./src/Swagger.json',
		'./src/Swagger/',
	],
	collectCoverageFrom: ['./src/**'],
	coverageThreshold: {
		global: {
			lines: 90,
		},
	},
}
