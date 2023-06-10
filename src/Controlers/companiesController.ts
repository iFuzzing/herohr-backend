import {Request, Response} from 'express'
import { validationResult } from 'express-validator'
import { clearTempFile } from '../Utils/utils'
import { companies as companiesModel } from '../Models/companies'
import sanitize from 'mongo-sanitize'

export async function newCompany(req:Request, res:Response){
	const pic: string = req?.file?.path.replace('temp_uploads','uploads') + '.png' as string
	const pic_name: string = req?.file?.filename + '.png' as string
	
	const validResult = validationResult(req)
	if(!validResult.isEmpty()){
		clearTempFile(pic)
		return res.status(400).json({erros: validResult.array()})
	}

	const name: string = sanitize(req.body?.name as string)
	const description: string = sanitize(req.body?.description as string)
	
	let recruiter: string = res.locals.recruiterid
	if(!recruiter){
		clearTempFile(pic)
		return res.sendStatus(401)
	}

	try{
		await companiesModel.create({
			recruiter: recruiter,
			name: name,
			description: description,
			picture: pic_name
		}) 
	}catch(err){
		clearTempFile(pic)
		return res.sendStatus(500)
	}


	return res.json({'sucess':'Nova empresa cadastrada'})
}

export async function getCompanies(req:Request, res:Response){
	const companies = await companiesModel.find({recruiter: res.locals.recruiterid}).select('name description picture')
	return res.json(companies)
}
