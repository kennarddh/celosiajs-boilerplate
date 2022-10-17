import mongoose, { Schema, Types } from 'mongoose'

export interface IUser {
	username: string
	name: string
	email: string
	password: string
	_id: Types.ObjectId
}

const User = new Schema<IUser>(
	{
		username: { type: String, required: true },
		name: { type: String, required: true },
		email: { type: String, required: true },
		password: { type: String, required: true },
	},
	{ timestamps: true }
)

export default mongoose.model('users', User)
