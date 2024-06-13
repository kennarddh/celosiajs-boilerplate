// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Debounce = <T extends (...args: any[]) => void>(callback: T, delay: number) => {
	let timerId: NodeJS.Timeout

	return (...args: Parameters<T>) => {
		clearTimeout(timerId)

		timerId = setTimeout(() => callback(...args), delay)
	}
}

export default Debounce
