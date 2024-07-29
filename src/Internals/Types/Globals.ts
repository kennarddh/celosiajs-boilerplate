/* eslint-disable @typescript-eslint/no-empty-interface */
declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace ExpressFramework {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		interface ExpressInstance<Strict extends boolean> {}
		interface ExpressRequest {}
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		interface ExpressRouter<Strict extends boolean> {}
		interface ExpressResponse {}
	}
}

export {}
