import {Request, Response} from 'express'
import { validationResult } from 'express-validator'
import { clearTempFile } from '../Utils/utils'
import { companies as companiesModel } from '../Models/companies'
import {jobs as jobsModel } from '../Models/jobs'
import { steps as stepsModel } from '../Models/steps'
import { applicants as applicantsModel } from '../Models/applicants'
import { linking as linkingModel } from '../Models/linking'
import sanitize from 'mongo-sanitize'
import path from 'path'

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

	try {
		const isDuplicate = await companiesModel.findOne({name: name, description: description})
		if(isDuplicate){
			clearTempFile(pic)
			return res.sendStatus(409)
		}
		
	} catch (err) {
		return res.sendStatus(500)
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
	const recruiter = sanitize(res.locals.recruiterid)
	let companies:any
	try{
		companies = await companiesModel.find({recruiter: recruiter}).sort({created_at: -1}).select('name description picture created_at')
	}catch(err){
		return res.sendStatus(500)
	}

	return res.json(companies)
}

export async function getCompany(req:Request, res:Response){
	const company_id = sanitize(req.query.id) as string
	const recruiter = sanitize(res.locals.recruiterid)
	
	if(company_id.length < 15 || company_id.length > 24){
		return res.sendStatus(400)
	}

	let company: any
	try {
		company = await companiesModel.findOne({_id: company_id, recruiter: recruiter}).select('_id name description picture')
		if(!company){
			return res.sendStatus(400)
		}
	} catch(err){
		return res.sendStatus(500)	
	}

	return res.json(company)
}

export async function deleteCompany(req:Request, res:Response){
	const company_id: string = sanitize(req?.query.id as string) as string
	const jobid: string = sanitize(req?.query.jobid as string) as string
	if(!company_id || company_id.length > 24 || company_id.length < 15){
		return res.sendStatus(400)
	}
	
	const recruiter: string = res.locals.recruiterid as string
	let pic = ''
	try{
		const company = await companiesModel.findOne({recruiter: recruiter, _id: company_id})
		if(!company){
			return res.sendStatus(400)
		}

		pic = company.picture
	}catch(err){
		return res.sendStatus(400)
	}

	try{
		await companiesModel.deleteOne({recruiter: recruiter, _id: company_id})
		await jobsModel.deleteMany({recruiter: recruiter, company: company_id})
		await stepsModel.deleteMany({recruiter: recruiter, company: company_id})
		await applicantsModel.deleteMany({recruiter: recruiter, company_id: company_id})
		await linkingModel.deleteMany({recruiter: recruiter, company: company_id})
	}catch(err){
		return res.sendStatus(500)
	}

	clearTempFile(path.join(__dirname,'..','..','public','uploads',pic))
	return res.json({'success': 'Empresa deletada'})
}

export async function editCompany(req:Request, res:Response){
	const company_id = sanitize(req.body.id)
	const name = sanitize(req.body.name)
	const description = sanitize(req.body.description)
	const pic: string = req?.file?.path.replace('temp_uploads','uploads') + '.png' as string
	const pic_name: string = req?.file?.filename + '.png' as string
	const recruiter = res.locals.recruiterid

	try{
		const company = await companiesModel.findOne({_id: company_id, recruiter: recruiter})
		if(!company){
			clearTempFile(pic)
			return res.sendStatus(400)
		}

		const old_pic_name = company.picture
		company.name = name
		company.description = description
		company.picture = pic_name
		await company.save()

		clearTempFile(path.join(__dirname,'..','..','public','uploads',old_pic_name))
	}catch(err){
		clearTempFile(pic)
		return res.sendStatus(500)
	}

	return res.json({'success':'Edição realizada'})
}
