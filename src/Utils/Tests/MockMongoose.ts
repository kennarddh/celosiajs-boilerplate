import mongoose, { Model } from 'mongoose'

mongoose.connect = jest.fn()

mongoose.createConnection = jest.fn().mockReturnValue({
	catch: jest.fn(),
	model: jest.fn(),
	on: jest.fn(),
	once: jest.fn(),
	then(resolve: (instance: typeof mongoose) => void) {
		resolve(this)
	},
})

const operations = ['save'] as const

export type ExpectedReturnType =
	| string
	| number
	| boolean
	| symbol
	| object
	| Record<string, string>
	| void
	| null
	| undefined

export type IOperation = typeof operations[number]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ModelType = Model<any, any, any, any, any>

interface PendingReturn {
	once: boolean
	expected: ExpectedReturnType
}

const PromiseByDefaultOperation: string[] = ['save']

const mocks = new Map<ModelType, Map<IOperation, PendingReturn[]>>()

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const spies: jest.SpyInstance<any, unknown[]>[] = []

class MockBase {
	model: ModelType

	constructor(model: ModelType) {
		this.model = model

		if (!mocks.has(this.model)) {
			mocks.set(this.model, new Map<IOperation, []>())

			this.#setup()
		}
	}

	#setup() {
		operations.forEach((operation: IOperation) => {
			mocks.get(this.model)?.set(operation, [])

			let mockReturnValue

			if (PromiseByDefaultOperation.includes(operation)) {
				mockReturnValue = this.#implementation(operation)
			} else {
				mockReturnValue = {
					exec: () => this.#implementation(operation),
				}
			}

			const spy = jest
				.spyOn(
					this.model.prototype,
					operation as any // eslint-disable-line @typescript-eslint/no-explicit-any
				)
				.mockReturnValue(mockReturnValue as any) // eslint-disable-line @typescript-eslint/no-explicit-any

			spies.push(spy)
		})
	}

	#reDefineSpy(operation: IOperation) {
		let mockReturnValue

		if (PromiseByDefaultOperation.includes(operation)) {
			mockReturnValue = this.#implementation(operation)
		} else {
			mockReturnValue = {
				exec: () => this.#implementation(operation),
			}
		}

		const spy = jest
			.spyOn(
				this.model.prototype,
				operation as any // eslint-disable-line @typescript-eslint/no-explicit-any
			)
			.mockReturnValue(mockReturnValue as any) // eslint-disable-line @typescript-eslint/no-explicit-any

		spies.push(spy)
	}

	#implementation(operation: IOperation): Promise<ExpectedReturnType> {
		return new Promise((resolve, reject) => {
			const returnsArray = mocks.get(this.model)?.get(operation)

			if (!returnsArray) {
				resolve({})

				return
			}

			if (!returnsArray[0]) {
				resolve({})

				return
			}

			const expectedReturn = returnsArray[0]

			if (expectedReturn.once) {
				returnsArray?.shift()

				this.#reDefineSpy(operation)
			}

			if (expectedReturn?.expected instanceof Error) {
				reject(expectedReturn)
			} else {
				resolve(expectedReturn)
			}
		})
	}

	toReturnBase(
		expected: ExpectedReturnType,
		operation: IOperation,
		once: boolean
	) {
		mocks.get(this.model)?.get(operation)?.push({ once, expected })

		this.#reDefineSpy(operation)

		return this
	}

	toReturn(expected: ExpectedReturnType, operation: IOperation) {
		this.toReturnBase(expected, operation, false)

		return this
	}

	toReturnOnce(expected: ExpectedReturnType, operation: IOperation) {
		this.toReturnBase(expected, operation, true)

		return this
	}
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export const ResetAll = () => {
	spies.forEach(spy => {
		spy.mockClear()
	})

	// Clear spies array
	spies.splice(0, spies.length)

	mocks.clear()
}

const Mock = (model: ModelType) => new MockBase(model)

export default Mock
