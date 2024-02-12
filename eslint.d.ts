type IConfig = Record<
	string,
	| import('eslint').Linter.FlatConfig
	| import('eslint').Linter.FlatConfig[]
	| import('eslint').ESLint.ConfigData<import('eslint').Linter.RulesRecord>
>

type IConfigs<T extends string, V = IConfig> = { [I in T]: V }

declare module '@typescript-eslint/parser' {
	type ParserModule = import('eslint').Linter.ParserModule

	const parser: ParserModule
	export = parser
}

declare module '@eslint/js' {
	export const configs: IConfigs<'recommended' | 'all'>
}

declare module 'eslint-plugin-import' {
	export const configs: IConfigs<
		| 'recommended'
		| 'errors'
		| 'warnings'
		| 'stage-0'
		| 'react'
		| 'react-native'
		| 'electron'
		| 'typescript'
	>

	const plugin: any

	export default plugin
}

declare module 'eslint-plugin-json' {
	export const configs: IConfigs<'recommended' | 'recommended-with-comments'>
}

declare module 'eslint-plugin-jsx-a11y' {
	export const configs: IConfigs<'recommended' | 'strict'>
}

declare module 'eslint-plugin-security' {
	export const configs: IConfigs<'recommended'>
}

declare module 'eslint-plugin-prettier' {
	export const configs: IConfigs<'recommended'>
}

declare module 'eslint-plugin-jest' {
	export const configs: IConfigs<'recommended' | 'all' | 'style'>
}

declare module 'eslint-config-airbnb-base' {
	const any: any
	export = any
}
