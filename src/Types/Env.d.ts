declare global {
	namespace NodeJS {
		interface ProcessEnv {
			PORT: string
			DB_HOST: string
			JWT_SECRET: string
			REFRESH_JWT_SECRET: string
			JWT_EXPIRE: string
			REFRESH_JWT_EXPIRE: string
			RATE_LIMITER_MAX: string
			RATE_LIMITER_WINDOW_MS: string
			LOG_LEVEL: string
			NODE_ENV: string
		}
	}
}

export {}
