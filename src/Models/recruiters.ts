import mongoose from "mongoose"

export const recruiters = mongoose.model('Recruiter', new mongoose.Schema({
	email:{
		type: String,
		require: true
	},
	password:{
		type: String,
		require: true
	},
	firstname:{
		type: String,
		require: true
	},
	lastname:{
		type: String,
		require: true
	},
	access_token:{
		type: String,
		require: true
	},
	create_at:{
		type: String,
		require: false,
		default: Date.now()
	},
	last_access:{
		type: String,
		require: false,
		default: Date.now()
	},

})
)

module.exports = {recruiters}

