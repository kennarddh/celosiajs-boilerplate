module.exports = {
	extends: [
		'airbnb-base',
		'plugin:prettier/recommended',
		'plugin:security/recommended',
	],
	plugins: ['prettier'],
	parserOptions: {
		ecmaVersion: 2020,
	},
	rules: {
		'prettier/prettier': [
			'warn',
			{
				endOfLine: 'lf',
			},
		],
		'import/prefer-default-export': 'off',
		'no-underscore-dangle': [
			'error',
			{
				allow: ['_id'],
			},
		],
		'no-console': 'error',
		'consistent-return': 'off',
		'no-unused-vars': 'warn',
		'import/extensions': ['warn', { js: 'never', json: 'never' }],
	},
}
