import js from '@eslint/js'
import { FlatConfig } from '@typescript-eslint/utils/ts-eslint'
import importPlugin from 'eslint-plugin-import'
import json from 'eslint-plugin-json'
import prettier from 'eslint-plugin-prettier'
import prettierRecommended from 'eslint-plugin-prettier/recommended'
import security from 'eslint-plugin-security'
import globals from 'globals'
import tsEslint from 'typescript-eslint'

export default tsEslint.config(
	{ ignores: ['build/**/*', 'eslint.config.d.ts'] },
	{
		languageOptions: {
			parser: tsEslint.parser as FlatConfig.Parser,
			parserOptions: {
				ecmaVersion: 'latest',
				sourceType: 'module',
				project: 'tsconfig.json',
				tsconfigRootDir: import.meta.dirname,
				extraFileExtensions: ['.json'],
			},
			globals: {
				...globals.node,
				...globals.browser,
				...globals.es2021,
			},
		},
	},
	js.configs.recommended,
	security.configs.recommended,
	...tsEslint.configs.strictTypeChecked,
	...tsEslint.configs.stylisticTypeChecked,
	prettierRecommended,
	{
		files: ['./src/**/*.ts', './eslint.config.ts', './scripts/**/*'],
		plugins: {
			json,
			import: importPlugin,
			'@typescript-eslint': tsEslint.plugin,
			prettier,
		},
		rules: {
			...json.configs['recommended'].rules,
			...importPlugin.configs['recommended'].rules,
			...importPlugin.configs['typescript'].rules,
			'@typescript-eslint/no-unused-vars': 'warn',
			'@typescript-eslint/no-empty-function': [
				'error',
				{ allow: ['private-constructors', 'protected-constructors'] },
			],
			'@typescript-eslint/no-confusing-void-expression': [
				'error',
				{
					ignoreArrowShorthand: true,
					ignoreVoidOperator: true,
				},
			],
			'@typescript-eslint/no-misused-promises': [
				'error',
				{
					checksVoidReturn: {
						arguments: false,
					},
				},
			],
			'@typescript-eslint/restrict-template-expressions': [
				'error',
				{
					allowNumber: true,
				},
			],
			'@typescript-eslint/require-await': 'off',
			'import/prefer-default-export': 'off',
			'import/extensions': ['warn', { ts: 'never', json: 'never' }],
			'prettier/prettier': 'warn',
		},
		settings: {
			'import/resolver': {
				typescript: {},
			},
		},
	},
	{
		files: ['eslint.config.ts', 'eslint.d.ts'],
		languageOptions: {
			parserOptions: {
				project: 'tsconfig.eslint.json',
			},
		},
		plugins: {
			import: importPlugin,
		},
		rules: {
			'import/no-extraneous-dependencies': [
				'error',
				{
					devDependencies: true,
				},
			],
		},
	},
	{
		files: ['./scripts/**/*'],
		languageOptions: {
			parserOptions: {
				project: './tsconfig.dev.json',
			},
		},
		plugins: {
			import: importPlugin,
		},
		rules: {
			'import/no-extraneous-dependencies': [
				'error',
				{
					devDependencies: true,
				},
			],
		},
	},
)
