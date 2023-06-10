import { Request, Response } from "express";
import path from 'path'
import sharp from 'sharp'
import fs from 'fs'
import { clearTempFile } from "../../Utils/utils";

async function sharpProccess(file: string){
	try {
		await sharp(file).toFile(file+'.png')
	} catch (error) {
		// TODO: salvar no logs de tentiva de ataque
		return false
	}

	return true
}

export default async function imageUploadProtection(req:Request, res:Response, next:any){

	const filename = req?.file?.filename as string
	const tempfile = req?.file?.path as string
	let err = false

	let image_type = null
	if(!filename){
		console.log("#0001")
		return res.sendStatus(400)
	}

	if(req?.file && req?.file.mimetype == 'image/png'){
		image_type = '.png'
	}else if(req?.file && req.file.mimetype === 'image/jpeg'){
		image_type = '.jpeg'
	}else{
		console.log("#0002")
		clearTempFile(tempfile)
		return res.sendStatus(400)
	}

	const original_name = req.file.originalname
	if(original_name.length > 62){
		console.log("#0003")
		clearTempFile(tempfile)
		return res.sendStatus(400)
	}

	
	// TODO: salvar nos logs como um ataque de FileUpload
	const not_allowed_ext = [
	'.phtml', '.php', '.php3', '.php4', '.php5', '.inc',
	'.asp', '.aspx',
	'.pl', '.pm', '.cgi', '.lib',
	'.jsp', '.jspx', '.jsw', '.jsv', '.jspf',
	'.cfm', '.cfml', '.cfc', '.dbm'
	]

	not_allowed_ext.forEach(ext=>{
		if(original_name.indexOf(ext) != -1 || path.extname(original_name) == ext){
			console.log("#0005") 
			err = true
		}
	})

	const allowed_ext = ['.png','.jpg','.jpeg']
	let isExtAllowed = false
	allowed_ext.forEach(ext=>{
		if(path.extname(original_name)===ext){
			isExtAllowed =  true
		}
	})

	if(!isExtAllowed){
		err = true
	}

	if(err){
		clearTempFile(tempfile)
		return res.sendStatus(400)
	}

	if(!await sharpProccess(req.file.path)){
		console.log("#0006")
		clearTempFile(tempfile)
		return res.sendStatus(400)
	}

	try{
		fs.renameSync(req.file.path+'.png', req.file.path.replace('temp_uploads','uploads')+'.png')
	}catch(err){
		console.log("#0007\n",err)
		clearTempFile(tempfile)
		return res.sendStatus(500)
	}

	clearTempFile(tempfile)
	next()
}
