// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type TokenJWTPayload = {
	id: number
}

export type FilteredStringUnionPrefix<
	T extends string,
	Prefix extends string,
> = T extends `${Prefix}${string}` ? T : never

export type FilteredStringUnionNotPrefix<
	T extends string,
	Prefix extends string,
> = T extends `${Prefix}${string}` ? never : T

export type FilteredStringUnionSuffix<
	T extends string,
	Suffix extends string,
> = T extends `${string}${Suffix}` ? T : never

export type FilteredStringUnionNotSuffix<
	T extends string,
	Suffix extends string,
> = T extends `${string}${Suffix}` ? never : T

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export type DeepPartialAndUndefined<T> = T extends Function
	? T
	: T extends object
		? {
				[P in keyof T]?: DeepPartialAndUndefined<T[P]> | undefined
			}
		: T
