import mongoose from "mongoose"

export const companies =  mongoose.model('Companie',new mongoose.Schema({
	recruiter:{
		type:String,
		required: true
	},
	name:{
		type: String,
		required: true
	},
	description:{
		type: String,
		required: true
	},
	picture:{
		type: String,
		required: true
	}
}))
