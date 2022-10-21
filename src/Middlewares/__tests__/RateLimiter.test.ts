describe('Rate limiter middleware', () => {
	const oldEnv = process.env

	beforeEach(() => {
		jest.resetModules() // Most important - it clears the cache
		process.env = { ...oldEnv } // Make a copy
	})

	afterAll(() => {
		process.env = oldEnv // Restore old environment
	})

	it('Should return empty function in development', async () => {
		process.env.NODE_ENV = 'development'

		const rateLimiterImport = await import('../RateLimiter')
		const rateLimiter = rateLimiterImport.default

		expect(rateLimiter.constructor.name).toBe('Function')
	})

	it('Should return empty function in production', async () => {
		process.env.NODE_ENV = 'production'

		const rateLimiterImport = await import('../RateLimiter')
		const rateLimiter = rateLimiterImport.default

		expect(rateLimiter.constructor.name).toBe('AsyncFunction')
	})
})
