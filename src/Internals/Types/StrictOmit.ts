import { EmptyObject } from 'Internals'

type StrictOmit<T, K extends keyof T> = {} extends Omit<T, K> ? EmptyObject : Omit<T, K>

export default StrictOmit
