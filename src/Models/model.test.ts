import mongoose from "mongoose";

const testSchema = new mongoose.Schema({
	userTest:{
		type: String,
		require: true
	}
})

export default mongoose.model('Test', testSchema)
