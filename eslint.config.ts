import { Linter } from 'eslint'
import js from '@eslint/js'

import globals from 'globals'

import typescriptParser from '@typescript-eslint/parser'

import security from 'eslint-plugin-security'
import json from 'eslint-plugin-json'
import jest from 'eslint-plugin-jest'
import ts from '@typescript-eslint/eslint-plugin'
import prettier from 'eslint-plugin-prettier'
import importPlugin, {
	configs as importPluginConfigs,
} from 'eslint-plugin-import'
import airbnbBase from 'eslint-config-airbnb-base'

import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url))

const config: Linter.FlatConfig[] = [
	{
		files: ['./src/**/*.{ts,tsx,json}', './eslint.config.ts', './scripts/**/*', './jest.config.ts'],
		languageOptions: {
			parser: typescriptParser,
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
			'@typescript-eslint': ts,
		},
		settings: {
			'import/resolver': {
				typescript: {},
			},
		},
		rules: {
			...ts.configs['eslint-recommended'].rules,
			...ts.configs['recommended'].rules,
			...js.configs['recommended'].rules,
			...json.configs['recommended'].rules,
			...security.configs['recommended'].rules,
			...prettier.configs['recommended'].rules,
			...importPluginConfigs['recommended'].rules,
			...importPluginConfigs['typescript'].rules,
			...jest.configs['recommended'].rules,
			...airbnbBase.rules,
			...(airbnbBase.extends as string[]).map(extend => require(extend).rules).reduce((acc, val) => ({...acc, ...val}), {}),
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
		}
	},
]

export default config
