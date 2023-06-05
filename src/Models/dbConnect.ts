import mongoose from "mongoose"
import { ConnectionOptions } from "tls"

const connectDB = async ()=>{
	console.log('[ * ] Conectando com o banco de dados...')
	const data_base_uri:string = process.env.DATA_BASE_URI as string
	try{
		await mongoose.connect(data_base_uri, {useUnifiedTopology: true, useNewUrlParser: true} as ConnectionOptions)
	}catch(err){
		console.log(err)
		console.log('[ ! ] Falha na conexão com o banco de dados')
	}
}

export default connectDB
