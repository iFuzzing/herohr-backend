import mongoose from "mongoose"

const contact = new mongoose.Schema({
	email:{
		type: String,
		required: false
	},
	linkedin:{
		type: String,
		required: false
	},
	phone:{
		type: String,
		required: false
	},
	github:{
		type: String,
		required: false
	}
})

const skills = new mongoose.Schema({
	skill:{
		type: String,
		required: true
	},
	value:{
		type: Number,
		required: true
	}
})

export const applicants = mongoose.model('Applicant',new mongoose.Schema({
	recruiter:{
		type: String,
		required: false
	},
	name:{
		type: String,
		required: true
	},
	email: {
		type: String,
		required: false
	},
	password: {
		type: String,
		required: false
	},
	picture:{
		type: String,
		required: true
	},
	aboutme:{
		type: String,
		required: false
	},
	contact:{
		type: contact,
		required: true
	},
	skills: [skills],
	portfolio:{
		type: String,
		required: false
	}
	
})) 
