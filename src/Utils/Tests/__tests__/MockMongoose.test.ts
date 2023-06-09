// Models
import User from 'Models/User'

import MockMongoose, { ResetAll } from '../MockMongoose'

describe('Mock Mongoose', () => {
	afterEach(() => {
		ResetAll()
	})

	it('save', async () => {
		const data = {
			username: 'b',
			name: 'c',
			email: 'd@x.com',
			password: 'hash',
		}

		MockMongoose(User).toReturn(data, 'save')

		const user = new User(data)

		const res = await user.save()

		expect(res).toEqual(data)
	})

	it('findOne', async () => {
		const data = { __v: 0 }

		MockMongoose(User).toReturn(data, 'findOne')

		const res = await User.findOne().exec()

		expect(res).toEqual(data)
	})

	it('find', async () => {
		const data = [{ __v: 0 }, { __v: 1 }]

		MockMongoose(User).toReturn(data, 'find')

		const res = await User.find().exec()

		expect(res).toEqual(data)
	})

	it('countDocuments', async () => {
		const data = 1

		MockMongoose(User).toReturn(data, 'countDocuments')

		const res = await User.countDocuments({ username: 'x' }).exec()

		expect(res).toEqual(data)
	})

	it('estimatedDocumentCount', async () => {
		const data = 1

		MockMongoose(User).toReturn(data, 'estimatedDocumentCount')

		const res = await User.estimatedDocumentCount().exec()

		expect(res).toEqual(data)
	})

	it('distinct', async () => {
		const data = ['foo', 'bar']

		MockMongoose(User).toReturn(data, 'distinct')

		const res = await User.distinct('username').exec()

		expect(res).toEqual(data)
	})

	it('findOneAndUpdate', async () => {
		const data = {
			_id: 'x',
			username: 'b',
			name: 'c',
			email: 'd@x.com',
			password: 'hash',
		}

		MockMongoose(User).toReturn(data, 'findOneAndUpdate')

		const res = await User.findOneAndUpdate(
			{ _id: 'id' },
			{ username: 'x' }
		).exec()

		expect(res).toEqual(data)
	})

	it('findOneAndDelete', async () => {
		const data = { __v: 0 }

		MockMongoose(User).toReturn(data, 'findOneAndDelete')

		const res = await User.findOneAndDelete().exec()

		expect(res).toEqual(data)
	})

	it('findOneAndReplace', async () => {
		const data = { __v: 0 }

		MockMongoose(User).toReturn(data, 'findOneAndReplace')

		const res = await User.findOneAndReplace().exec()

		expect(res).toEqual(data)
	})

	it('updateOne', async () => {
		const data = {
			matchedCount: 1,
			modifiedCount: 1,
			acknowledged: true,
			upsertedId: 'a',
			upsertedCount: 1,
		}

		MockMongoose(User).toReturn(data, 'updateOne')

		const res = await User.updateOne({ _id: 'a' }, { name: 'x' }).exec()

		expect(res).toEqual(data)
	})

	it('updateMany', async () => {
		const data = {
			n: 10,
			nModified: 10,
		}

		MockMongoose(User).toReturn(data, 'updateMany')

		const res = await User.updateMany({ name: /a$/ }, { name: 'x' }).exec()

		expect(res).toEqual(data)
	})

	it('deleteOne', async () => {
		const data = { deletedCount: 1 }

		MockMongoose(User).toReturnOnce(data, 'deleteOne')

		const res = await User.deleteOne({ name: 'x' }).exec()

		expect(res).toEqual(data)
	})

	it('deleteMany', async () => {
		const data = { deletedCount: 10 }

		MockMongoose(User).toReturnOnce(data, 'deleteMany')

		const res = await User.deleteMany({ name: /^x/ }).exec()

		expect(res).toEqual(data)
	})

	it('populate find', async () => {
		const data = { user: { username: 'x' }, books: { books: ['a', 'b'] } }

		MockMongoose(User).toReturnOnce(data, 'find')

		const res = await User.find({ name: /^x/ })
			.populate('user')
			.populate('books')
			.exec()

		expect(res).toEqual(data)
	})

	it('aggregate', async () => {
		const data = [
			{ _id: 24, count: 1 },
			{ _id: 28, count: 1 },
			{ _id: 29, count: 2 },
		]

		MockMongoose(User).toReturnOnce(data, 'aggregate')

		const res = await User.aggregate()
			.match({ age: { $lt: 30 } })
			.group({ _id: 'x' })
			.exec()

		expect(res).toEqual(data)
	})

	it('replaceOne', async () => {
		const data = {
			matchedCount: 1,
			modifiedCount: 1,
			acknowledged: true,
			upsertedId: 'a',
			upsertedCount: 1,
		}

		MockMongoose(User).toReturn(data, 'replaceOne')

		const res = await User.replaceOne({ _id: 'a' }, { name: 'x' }).exec()

		expect(res).toEqual(data)
	})

	it('empty mock', async () => {
		MockMongoose(User)

		const res = await User.replaceOne({ _id: 'a' }, { name: 'x' }).exec()

		expect(res).toEqual({})
	})

	it('multiple find 1 mock', async () => {
		const data = [{ __v: 0 }, { __v: 1 }]

		MockMongoose(User).toReturnOnce(data, 'find')

		const res = await User.find().exec()
		const res2 = await User.find().exec()

		expect(res).toEqual(data)
		expect(res2).toEqual({})
	})
})
