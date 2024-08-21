import js from '@eslint/js'
import { FlatConfig } from '@typescript-eslint/utils/ts-eslint'
// import importPlugin from 'eslint-plugin-import'
import prettier from 'eslint-plugin-prettier'
import prettierRecommended from 'eslint-plugin-prettier/recommended'
import security from 'eslint-plugin-security'
import globals from 'globals'
import tsEslint from 'typescript-eslint'

// TODO: Enable eslint-plugin-import again when it supports flat config by uncommenting all commented lines
// https://github.com/import-js/eslint-plugin-import/issues/2556

// Also eslint-import-resolver-typescript

export default tsEslint.config(
	{ ignores: ['build/**/*', 'eslint.config.d.ts', 'eslint.config.js'] },
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
		name: 'Prettier Warn',
		plugins: {
			prettier,
		},
		rules: {
			'prettier/prettier': 'warn',
		},
	},
	{
		files: ['**/*.ts', 'eslint.config.ts'],
		plugins: {
			// import: importPlugin,
			'@typescript-eslint': tsEslint.plugin,
			security,
		},
		rules: {
			// ...importPlugin.configs.recommended.rules,
			// ...importPlugin.configs.typescript.rules,
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
			'@typescript-eslint/no-unused-vars': [
				'warn',
				{
					argsIgnorePattern: '^_',
					caughtErrorsIgnorePattern: '^_',
					destructuredArrayIgnorePattern: '^_',
					varsIgnorePattern: '^_',
				},
			],
			'@typescript-eslint/no-confusing-void-expression': 'off',
			// 'import/prefer-default-export': 'off',
			// 'import/extensions': ['warn', { ts: 'never', json: 'never' }],
		},
		// settings: {
		// 'import/resolver': {
		// 	typescript: {},
		// },
		// },
	},
	{
		files: ['eslint.config.ts', 'eslint.d.ts'],
		languageOptions: {
			parserOptions: {
				project: 'tsconfig.eslint.json',
			},
		},
		plugins: {
			// import: importPlugin,
		},
		rules: {
			// 'import/no-extraneous-dependencies': [
			// 	'error',
			// 	{
			// 		devDependencies: true,
			// 	},
			// ],
		},
	},
	{
		files: ['scripts/**/*'],
		languageOptions: {
			parserOptions: {
				project: 'tsconfig.dev.json',
			},
		},
		// plugins: {
		// 	import: importPlugin,
		// },
		// rules: {
		// 	'import/no-extraneous-dependencies': [
		// 		'error',
		// 		{
		// 			devDependencies: true,
		// 		},
		// 	],
		// },
	},
)
