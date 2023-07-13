import mongoose from "mongoose"

const tags = new mongoose.Schema({
	text:{
		type: String,
		required: true
	},
	color:{
		type: String,
		required: true
	}
})

export const linking = mongoose.model('Linking',new mongoose.Schema({
	recruiter:{
		type: String,
		required: true
	},
	job:{
		type: String,
		required: true
	},
	applicant:{
		type: String,
		required: true
	},
	applicant_name:{
		type: String,
		required: true
	},
	applicant_pic:{
		type: String,
		required: true
	},
	status:{
		type: String,
		required: true
	},
	tags:[tags],
	step:{
		type: Number,
		required: true
	}

}))
