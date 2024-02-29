import type { JestConfigWithTsJest } from 'ts-jest'

const jestConfig: JestConfigWithTsJest = {
	testEnvironment: 'node',
	coveragePathIgnorePatterns: ['/node_modules/'],
	collectCoverageFrom: ['./src/**'],
	coverageThreshold: {
		global: {
			branches: 90,
			functions: 90,
			lines: 90,
			statements: 90,
		},
	},
	testPathIgnorePatterns: ['./build', './Logs', './scripts'],
	testRegex: '((__tests__)|(\\.(test|spec)\\.[jt]s$))',
	preset: 'ts-jest',
	moduleNameMapper: {
		'Utils/(.*)': '<rootDir>/src/Utils/$1',
		'Versions/(.*)': '<rootDir>/src/Versions/$1',
		'Database/(.*)': '<rootDir>/src/Database/$1',
		'Services/(.*)': '<rootDir>/src/Services/$1',
		'Middlewares/(.*)': '<rootDir>/src/Middlewares/$1',
		'Routes/(.*)': '<rootDir>/src/Routes/$1',
		'Types/(.*)': '<rootDir>/src/Types/$1',
		'Models/(.*)': '<rootDir>/src/Models/$1',
		App: '<rootDir>/src/App.ts',
	},
}

export default jestConfig
