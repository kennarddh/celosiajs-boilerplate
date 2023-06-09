// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Args = any[]

const Debounce = (callback: (...args: Args) => void, delay: number) => {
	let timerId: NodeJS.Timeout

	return (...args: Args) => {
		clearTimeout(timerId)

		timerId = setTimeout(() => callback(...args), delay)
	}
}

export default Debounce
