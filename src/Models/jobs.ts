import mongoose from "mongoose"

export const jobs = mongoose.model('Job',new mongoose.Schema({
	company: {
		type: String,
		required: true
	},
	recruiter: {
		type: String,
		required: true
	},
	name: {
		type: String,
		required: true,
	},
	description: {
		type: String,
		required: true
	},
	created_at:{
		type: Date,
		required: false,
		default: Date.now
	}
}))
