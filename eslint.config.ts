import js from '@eslint/js'
import type { FlatConfig } from '@typescript-eslint/utils/ts-eslint'
import airbnbBase from 'eslint-config-airbnb-base'
import importPlugin from 'eslint-plugin-import'
import jest from 'eslint-plugin-jest'
import json from 'eslint-plugin-json'
import prettier from 'eslint-plugin-prettier'
import security from 'eslint-plugin-security'
import globals from 'globals'
import { createRequire } from 'node:module'
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import tsEslint from 'typescript-eslint'

const require = createRequire(import.meta.url)
const __dirname = dirname(fileURLToPath(import.meta.url))

export default tsEslint.config(
	{
		files: [
			'./src/**/*.{ts,tsx,json}',
			'./eslint.config.ts',
			'./scripts/**/*',
			'./jest.config.ts',
		],
		languageOptions: {
			parser: tsEslint.parser as FlatConfig.Parser,
			parserOptions: {
				ecmaVersion: 'latest',
				project: './tsconfig.json',
				tsconfigRootDir: __dirname,
			},
			globals: {
				...globals.node,
				...globals.jest,
			},
		},
		plugins: {
			jest,
			security,
			prettier,
			json,
			import: importPlugin,
			'@typescript-eslint': tsEslint.plugin,
		},
		settings: {
			'import/resolver': {
				typescript: {},
			},
		},
		rules: {
			...tsEslint.configs['eslintRecommended'].rules,
			...tsEslint.configs['recommended']
				.map(config => config.rules)
				.reduce((acc, val) => ({ ...acc, ...val }), {}),
			...js.configs['recommended'].rules,
			...json.configs['recommended'].rules,
			...security.configs['recommended'].rules,
			...prettier.configs['recommended'].rules,
			...importPlugin.configs['recommended'].rules,
			...importPlugin.configs['typescript'].rules,
			...jest.configs['recommended'].rules,
			...airbnbBase.rules,
			...(airbnbBase.extends as string[])
				.map(extend => require(extend).rules)
				.reduce((acc, val) => ({ ...acc, ...val }), {}),
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
			'no-console': 'warn',
			'consistent-return': 'off',
			'import/extensions': ['warn', { ts: 'never', json: 'never' }],
			'prefer-promise-reject-errors': 'off',
			'@typescript-eslint/no-unused-vars': [
				'warn',
				{ varsIgnorePattern: '^_' },
			],
		},
	},
	{
		files: ['./eslint.config.ts'],
		languageOptions: {
			parserOptions: {
				project: './tsconfig.eslint.json',
			},
		},
		rules: {
			'import/no-extraneous-dependencies': [
				'error',
				{
					devDependencies: [
						'typescript-eslint',
						'@typescript-eslint/utils',
					],
				},
			],
		},
	},
	{
		files: ['./scripts/**/*', './jest.config.ts'],
		languageOptions: {
			parserOptions: {
				project: './tsconfig.dev.json',
			},
		},
		rules: {
			'import/no-extraneous-dependencies': [
				'error',
				{
					devDependencies: [
						'**/*.test.ts',
						'**/*.spec.ts',
						'**/__tests__/**/*.ts',
						'./scripts/**/*.ts',
					],
				},
			],
		},
	},
)
