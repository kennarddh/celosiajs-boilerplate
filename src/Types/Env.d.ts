declare global {
	namespace NodeJS {
		interface ProcessEnv {
			NODE_ENV: string
			PORT: string
			DATABASE_URL: string
			ACCESS_TOKEN_SECRET: string
			ACCESS_TOKEN_EXPIRE: string
			REFRESH_TOKEN_SECRET: string
			REFRESH_TOKEN_EXPIRE: string
			RATE_LIMITER_MAX: string
			RATE_LIMITER_WINDOW: string
			LOG_LEVEL: string
			PASSWORD_HASH_SECRET: string
			CORS_ORIGIN: string
		}
	}
}

export {}
