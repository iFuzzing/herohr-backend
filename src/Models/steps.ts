import mongoose from "mongoose"

export const steps = mongoose.model('Step', new mongoose.Schema({
	recruiter: {
		type: String,
		required: true
	},
	company:{
		type: String,
		required: true
	},
	job:{
		type: String,
		required: true
	},
	position:{
		type: Number,
		required: true
	},
	description:{
		type: String,
		required: true
	},
	created_at:{
		type: Date,
		required: false,
		default: Date.now
	}
})) 
