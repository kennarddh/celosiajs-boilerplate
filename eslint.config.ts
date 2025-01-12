import js from '@eslint/js'
import { FlatConfig } from '@typescript-eslint/utils/ts-eslint'
import eslintPluginImportX from 'eslint-plugin-import-x'
import prettier from 'eslint-plugin-prettier'
import prettierRecommended from 'eslint-plugin-prettier/recommended'
import security from 'eslint-plugin-security'
import globals from 'globals'
import tsEslint from 'typescript-eslint'

export default tsEslint.config(
	js.configs.recommended,
	eslintPluginImportX.flatConfigs.recommended,
	eslintPluginImportX.flatConfigs.typescript,
	security.configs.recommended,
	...tsEslint.configs.strictTypeChecked,
	...tsEslint.configs.stylisticTypeChecked,
	prettierRecommended,
	{ ignores: ['**/build/**/*'] },
	{
		languageOptions: {
			parser: tsEslint.parser as FlatConfig.Parser,
			parserOptions: {
				ecmaVersion: 'latest',
				sourceType: 'module',
				tsconfigRootDir: import.meta.dirname,
				projectService: true,
				extraFileExtensions: ['.json'],
			},
			globals: {
				...globals.node,
				...globals.es2021,
			},
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
	{
		files: ['**/*.ts', 'eslint.config.ts'],
		plugins: {
			'@typescript-eslint': tsEslint.plugin,
			security,
		},
		rules: {
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
			'import-x/extensions': ['warn', { ts: 'never', json: 'never' }],
			'import-x/no-named-as-default-member': 'off',
		},
	},
)
