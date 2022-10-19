declare module 'mockingoose' {
	import { Model, Aggregate, Query } from 'mongoose'

	type AvailableOperations =
		| 'find'
		| 'findOne'
		| 'count'
		| 'countDocuments'
		| 'estimatedDocumentCount'
		| 'distinct'
		| 'findOneAndUpdate'
		| 'findOneAndDelete'
		| 'findOneAndRemove'
		| 'findOneAndReplace'
		| 'remove'
		| 'update'
		| 'deleteOne'
		| 'deleteMany'
		| 'save'
		| 'aggregate'

	type Operation = AvailableOperations[number]

	type ToReturnObject =
		| Record<string, string>
		| string
		| number
		| boolean
		| symbol
		| object
		| void
		| null
		| undefined

	interface Mock {
		/**
		 * Specify an expected result for a specific mongoose function. This can be a primitive value or a function.
		 * If used with a function, you will have access to the Query or Aggregate mongoose class.
		 * @param expected Primitive value or function that returns the mocked value
		 * @param operation The operation to mock
		 */
		toReturn: (
			expected:
				| ToReturnObject
				| Query<any, any, any, any> // eslint-disable-line @typescript-eslint/no-explicit-any
				| Aggregate<any>, // eslint-disable-line @typescript-eslint/no-explicit-any
			operation: Operation
		) => this

		/**
		 * Reset all mocks
		 * @param op Optional parameter to reset, if not specified, resets everything
		 */
		reset(op?: Operation): this

		/**
		 * Returns an object of mocks for this model. Only serializable if all mock results are primitives, not functions.
		 */
		toJSON(): string | undefined
	}

	interface Target {
		__mocks: any // eslint-disable-line @typescript-eslint/no-explicit-any

		/**
		 * Resets all mocks.
		 */
		resetAll(): void

		/**
		 * Returns an object of mocks for all models. Only serializable if all mock results are primitives, not functions.
		 */
		toJSON(): string | undefined
	}

	/**
	 * Returns a helper with which you can set up mocks for a particular Model
	 * @param {string | mongoose.Model} model either a string model name, or a mongoose.Model instance
	 */
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	type MockModel = (model: Model<any, any, any, any>) => Mock

	type Proxy = Target & MockModel

	const mockingoose: Proxy

	export default mockingoose
}
