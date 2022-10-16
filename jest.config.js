module.exports = {
	testEnvironment: 'node',
	coveragePathIgnorePatterns: [
		'/node_modules/',
		'./src/Swagger.json',
		'./src/Swagger/',
		'./scripts/**/*.[jt]s',
	],
	collectCoverageFrom: ['./src/**'],
	coverageThreshold: {
		global: {
			branches: 90,
			functions: 90,
			lines: 90,
			statements: 90,
		},
	},
	testRegex: '((__tests__\\/)|(\\.(test|spec)\\.[jt]s$))',
}
