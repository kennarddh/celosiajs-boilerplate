import mongoose, { Model } from 'mongoose'

mongoose.connect = jest.fn()

mongoose.createConnection = jest.fn().mockReturnValue({
	catch: jest.fn(),
	model: jest.fn(),
	on: jest.fn(),
	once: jest.fn(),
	then: jest.fn(),
})

const operations = [
	'save',
	'findOne',
	'find',
	'countDocuments',
	'estimatedDocumentCount',
	'distinct',
	'findOneAndUpdate',
	'findOneAndDelete',
	'findOneAndReplace',
	'updateOne',
	'updateMany',
	'deleteOne',
	'deleteMany',
	'aggregate',
	'replaceOne',
] as const

type All = string | number | boolean | symbol | object | void | null | undefined

type NestedRecord = {
	[key: string]: NestedRecord | All
}

export type ExpectedReturnType = All | NestedRecord

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ReturnTypeFunction = (...x: any[]) => ExpectedReturnType

export type IOperation = (typeof operations)[number]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ModelType = Model<any, any, any, any, any>

interface PendingReturn {
	once: boolean
	expected: ExpectedReturnType | ReturnTypeFunction
}

const PromiseByDefaultOperation: IOperation[] = ['save']
const ModelTypeOperation: IOperation[] = ['save']
const PopulatableOperation: IOperation[] = ['find', 'findOne']

const AggregateMethod: string[] = [
	'match',
	'group',
	'addFields',
	'allowDiskUse',
	'append',
	'catch',
	'collation',
	'count',
	'cursor',
	'densify',
	'explain',
	'facet',
	'graphLookup',
	'group',
	'hint',
	'limit',
	'lookup',
	'match',
	'model',
	'near',
	'option',
	'pipeline',
	'project',
	'read',
	'readConcern',
	'redact',
	'replaceRoot',
	'sample',
	'search',
	'session',
	'skip',
	'sort',
	'sortByCount',
	'unionWith',
	'unwind',
]

const mocks = new Map<ModelType, Map<IOperation, PendingReturn[]>>()

const spies = new Map<
	ModelType,
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	Map<IOperation, jest.SpyInstance<any, unknown[]> | undefined>
>()

class MockBase {
	model: ModelType

	constructor(model: ModelType) {
		this.model = model

		if (!mocks.has(this.model)) {
			mocks.set(this.model, new Map<IOperation, []>())

			this.#setup()
		}

		if (!spies.has(this.model)) {
			spies.set(
				this.model,
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				new Map<IOperation, undefined>()
			)

			this.#setup()
		}
	}

	#setup() {
		operations.forEach((operation: IOperation) => {
			mocks.get(this.model)?.set(operation, [])
			spies.get(this.model)?.set(operation, undefined)

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
			mockReturnValue = (args: unknown[]) => {
				if (PopulatableOperation.includes(operation)) {
					return {
						exec: () => this.#implementation(operation, args),
						populate: () => this.#populate(operation, args),
					}
				}
				return {
					exec: () => this.#implementation(operation, args),
				}
			}
		}

		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		let spyTarget: any

		if (ModelTypeOperation.includes(operation)) {
			spyTarget = this.model.prototype
		} else if (operation === 'aggregate') {
			spyTarget = mongoose.Aggregate.prototype
		} else {
			spyTarget = mongoose.Query.prototype
		}

		if (operation !== 'aggregate') {
			const spy = jest
				.spyOn(spyTarget, operation)
				.mockImplementation((...args) => {
					return mockReturnValue(args)
				})

			spies.get(this.model)?.set(operation, spy)
		} else {
			AggregateMethod.forEach(method => {
				const spy = jest
					.spyOn(spyTarget, method)
					.mockImplementation((...args) => {
						return this.#aggregate(operation, args)
					})

				spies.get(this.model)?.set(operation, spy)
			})
		}
	}

	#populate(operation: IOperation, args: unknown[]) {
		return {
			exec: () => this.#implementation(operation, args),
			populate: () => this.#populate(operation, args),
		}
	}

	#aggregate(operation: IOperation, args: unknown[]) {
		const returnObject: Record<string, unknown> = {
			exec: () => this.#implementation(operation, args),
		}

		AggregateMethod.forEach(method => {
			// eslint-disable-next-line security/detect-object-injection
			returnObject[method] = () => this.#aggregate(operation, args)
		})

		return returnObject
	}

	#implementation(
		operation: IOperation,
		args: unknown[]
	): Promise<ExpectedReturnType> {
		const { model } = this

		return new Promise((resolve, reject) => {
			const returnsArray = mocks
				.get(model)
				?.get(operation) as PendingReturn[]

			if (!returnsArray[0]) {
				resolve({})

				return
			}

			const expectedReturn = returnsArray[0]

			if (expectedReturn.once) {
				returnsArray.shift()

				this.#reDefineSpy(operation)
			}

			if (expectedReturn.expected instanceof Error) {
				reject(expectedReturn)
			} else {
				if (typeof expectedReturn.expected === 'function') {
					const expected: ExpectedReturnType =
						expectedReturn.expected(...args)

					resolve(expected)

					return
				}

				resolve(expectedReturn.expected)
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
	spies.forEach(model => {
		model.forEach(spy => spy?.mockClear())
	})

	mocks.clear()
	mocks.clear()
}

const Mock = (model: ModelType) => new MockBase(model)

export default Mock
