import mongoose from "mongoose"

export const recruiters = mongoose.model('Recruiter', new mongoose.Schema({
	email:{
		type: String,
		required: true
	},
	password:{
		type: String,
		required: true
	},
	firstname:{
		type: String,
		required: true
	},
	lastname:{
		type: String,
		required: true
	},
	access_token:{
		type: String,
		required: true
	},
	create_at:{
		type: String,
		required: false,
		default: Date.now()
	},
	last_access:{
		type: String,
		required: false,
		default: Date.now()
	},

})
)
