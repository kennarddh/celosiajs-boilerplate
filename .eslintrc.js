module.exports = {
	extends: ['airbnb-base', 'plugin:prettier/recommended'],
	plugins: ['prettier'],
	parserOptions: {
		ecmaVersion: 2020,
	},
	rules: {
		'prettier/prettier': [
			'warn',
			{
				endOfLine: 'auto',
			},
		],
		'import/prefer-default-export': 'off',
		'no-underscore-dangle': [
			'error',
			{
				allow: ['_id'],
			},
		],
		'no-console': 'off',
		'consistent-return': 'off',
		'no-unused-vars': 'warn',
	},
}
