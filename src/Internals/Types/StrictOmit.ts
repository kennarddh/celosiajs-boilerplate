import { EmptyObject } from 'Internals'

// eslint-disable-next-line @typescript-eslint/ban-types
type StrictOmit<T, K extends keyof T> = {} extends Omit<T, K> ? EmptyObject : Omit<T, K>

export default StrictOmit
