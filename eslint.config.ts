import js from '@eslint/js'
import importX from 'eslint-plugin-import-x'
import prettier from 'eslint-plugin-prettier'
import prettierRecommended from 'eslint-plugin-prettier/recommended'
import security from 'eslint-plugin-security'
import globals from 'globals'
import tsEslint from 'typescript-eslint'

export default tsEslint.config(
	js.configs.recommended,
	importX.flatConfigs.recommended,
	importX.flatConfigs.typescript,
	tsEslint.configs.strictTypeChecked,
	tsEslint.configs.stylisticTypeChecked,
	prettierRecommended,
	{ name: 'Ignores', ignores: ['build/**/*'] },
	{
		name: 'Main',
		files: ['**/*.ts', 'eslint.config.ts'],
		languageOptions: {
			parser: tsEslint.parser,
			parserOptions: {
				ecmaVersion: 2025,
				tsconfigRootDir: import.meta.dirname,
				projectService: true,
			},
			globals: {
				...globals.node,
				...globals.es2025,
			},
		},
		plugins: {
			'@typescript-eslint': tsEslint.plugin,
			security,
		},
		rules: {
			...security.configs.recommended.rules,
			'no-unused-vars': 'off',
			'@typescript-eslint/no-unused-vars': [
				'warn',
				{
					argsIgnorePattern: '^_',
					caughtErrorsIgnorePattern: '^_',
					destructuredArrayIgnorePattern: '^_',
					varsIgnorePattern: '^_',
				},
			],
			'@typescript-eslint/no-empty-function': [
				'error',
				{ allow: ['private-constructors', 'protected-constructors'] },
			],
			'@typescript-eslint/no-misused-promises': [
				'error',
				{
					checksVoidReturn: false,
				},
			],
			'@typescript-eslint/restrict-template-expressions': [
				'error',
				{
					allowNumber: true,
				},
			],
			'@typescript-eslint/require-await': 'off',
			'@typescript-eslint/no-confusing-void-expression': 'off',
			'import-x/extensions': ['warn', { ts: 'never', json: 'never' }],
			'import-x/no-named-as-default-member': 'off',
		},
	},
	{
		name: 'Prettier Warn',
		plugins: {
			prettier,
		},
		rules: {
			'prettier/prettier': 'warn',
		},
	},
)
