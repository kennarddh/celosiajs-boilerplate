import mongoose, { Schema } from 'mongoose'

const Example = new Schema(
	{
		message: { type: String, required: true },
	},
	{ timestamps: true }
)

export default mongoose.model('example', Example)
