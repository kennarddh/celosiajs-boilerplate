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

const operations = ['save', 'findOne'] as const

export type ExpectedReturnType =
	| string
	| number
	| boolean
	| symbol
	| object
	| Record<string, any> // eslint-disable-line @typescript-eslint/no-explicit-any
	| void
	| null
	| undefined

export type ReturnTypeFunction = (
	query: Record<string, any> // eslint-disable-line @typescript-eslint/no-explicit-any
) => ExpectedReturnType

export type IOperation = typeof operations[number]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ModelType = Model<any, any, any, any, any>

interface PendingReturn {
	once: boolean
	expected: ExpectedReturnType | ReturnTypeFunction
}

const PromiseByDefaultOperation: string[] = ['save']
const ModelTypeOperation: string[] = ['save']

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

			this.#reDefineSpy(operation)
		})
	}

	#reDefineSpy(operation: IOperation) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		let mockReturnValue: (args: unknown[]) => any

		if (PromiseByDefaultOperation.includes(operation)) {
			mockReturnValue = (args: unknown[]) =>
				this.#implementation(operation, args)
		} else {
			mockReturnValue = (args: unknown[]) => ({
				exec: () => this.#implementation(operation, args),
			})
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		let spyTarget: any

		if (ModelTypeOperation.includes(operation)) {
			spyTarget = this.model.prototype
		} else {
			spyTarget = mongoose.Query.prototype
		}

		const spy = jest
			.spyOn(
				spyTarget,
				operation as any // eslint-disable-line @typescript-eslint/no-explicit-any
			)
			.mockImplementation((...args) => {
				return mockReturnValue(args)
			})

		spies.push(spy)
	}

	#implementation(
		operation: IOperation,
		args: unknown[]
	): Promise<ExpectedReturnType> {
		const { model } = this

		return new Promise((resolve, reject) => {
			const returnsArray = mocks.get(model)?.get(operation)

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
				if (typeof expectedReturn?.expected === 'function') {
					const expected: ExpectedReturnType =
						expectedReturn?.expected(
							args[0] as Record<string, string>
						)

					resolve(expected)

					return
				}

				resolve(expectedReturn)
			}
		})
	}

	toReturnBase(
		expected: ExpectedReturnType | ReturnTypeFunction,
		operation: IOperation,
		once: boolean
	) {
		mocks.get(this.model)?.get(operation)?.push({ once, expected })

		this.#reDefineSpy(operation)

		return this
	}

	toReturn(
		expected: ExpectedReturnType | ReturnTypeFunction,
		operation: IOperation
	) {
		this.toReturnBase(expected, operation, false)

		return this
	}

	toReturnOnce(
		expected: ExpectedReturnType | ReturnTypeFunction,
		operation: IOperation
	) {
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
