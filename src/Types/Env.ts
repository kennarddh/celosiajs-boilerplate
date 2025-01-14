export interface ProcessEnvVariables {
	NODE_ENV: string

	HOST: string
	PORT: string

	DATABASE_URL?: string
	DATABASE_URL_FILE?: string

	ACCESS_TOKEN_SECRET?: string
	ACCESS_TOKEN_SECRET_FILE?: string
	ACCESS_TOKEN_EXPIRE: string

	REFRESH_TOKEN_SECRET?: string
	REFRESH_TOKEN_SECRET_FILE?: string
	REFRESH_TOKEN_EXPIRE: string

	RATE_LIMITER_MAX: string
	RATE_LIMITER_WINDOW: string

	PASSWORD_HASH_SECRET?: string
	PASSWORD_HASH_SECRET_FILE?: string

	CORS_ORIGIN: string

	LOG_LEVEL: string
	LOG_PATH: string
}

declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace NodeJS {
		// eslint-disable-next-line @typescript-eslint/no-empty-object-type
		interface ProcessEnv extends ProcessEnvVariables {}
	}
}
