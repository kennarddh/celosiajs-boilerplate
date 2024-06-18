// A hacky way to make invariant symbol works in typescript
// Just Symbol() won't work
declare const stopHereSymbol: unique symbol

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
export const StopHere: {
	[stopHereSymbol]: never
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
} = Symbol('InternalStopHere') as any
