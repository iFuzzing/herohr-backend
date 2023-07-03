import {Request, Response} from 'express'
import sanitize from 'mongo-sanitize'
import { companies as companiesModel } from '../Models/companies'
import { jobs as jobsModel } from '../Models/jobs'	
import { steps as stepsModel } from '../Models/steps' 
import { validationResult } from 'express-validator'

export async function newStep(req: Request, res: Response){
	
	const validResult = validationResult(req)
	if(!validResult.isEmpty()){
		return res.status(400).json({erros: validResult.array()})
	}

	const description = sanitize(req.body.description) as string
	const companyId = sanitize(req.body.company) as string
	const jobId = sanitize(req.body.job) as string
	const recruiter = sanitize(res.locals.recruiterid) as string

	try {
		const companyMatch = await companiesModel.findOne({_id: companyId, recruiter: recruiter})	
		if(!companyMatch){
			return res.sendStatus(400)
		}
	} catch (err) {
		return res.sendStatus(500)
	}	

	try {
		const jobMatch = await jobsModel.findOne({_id: jobId, company: companyId, recruiter: recruiter})	
		if(!jobMatch){
			return res.sendStatus(400)
		}
	} catch (err) {
		return res.sendStatus(500)
	}

	const stepCurrentPos = await stepsModel.countDocuments({recruiter: recruiter, job: jobId}) 

	const stepNewPos = stepCurrentPos + 1
	try {
		await stepsModel.create({
			recruiter: recruiter,
			job: jobId,
			company: companyId,
			position: stepNewPos,
			description: description,

		})	
	} catch (err) {
		return res.sendStatus(500)
	}

	res.json({'message':'Nova etapa registrada'})
}

export async function getSteps(req:Request, res:Response){
	const companyId = sanitize(req.query.company) as string
	const jobId = sanitize(req.query.job) as string
	const recruiter = sanitize(res.locals.recruiterid) as string

	try {
		const companyMatch = await companiesModel.findOne({_id: companyId, recruiter: recruiter})	
		if(!companyMatch){
			return res.sendStatus(400)
		}
	} catch (err) {
		return res.sendStatus(500)
	}	

	try {
		const jobMatch = await jobsModel.findOne({_id: jobId, company: companyId, recruiter: recruiter})	
		if(!jobMatch){
			return res.sendStatus(400)
		}
	} catch (err) {
		return res.sendStatus(500)
	}

	let steps:any
	try {
		steps = await stepsModel.find({company: companyId, job: jobId, recruiter: recruiter}).select('_id position description')	
	} catch (err) {
		return res.sendStatus(500)
	}

	return res.json(steps)
}

export async function getStep(req: Request, res: Response){
	const stepid = sanitize(req.query.step) as string
	const company = sanitize(req.query.company) as string
	const job = sanitize(req.query.job) as string
	const recruiter = sanitize(res.locals.recruiterid)

	try {
		const step = await stepsModel.findOne({recruiter: recruiter, company: company, job: job, _id: stepid})	
		if(!step){
			return res.sendStatus(400)
		}

		return res.json(step)
	} catch (err) {
		return res.sendStatus(500)
	}
}

export async function deleteStep(req: Request, res: Response){
	const stepid = sanitize(req.query.step) as string
	const company = sanitize(req.query.company) as string
	const job = sanitize(req.query.job) as string
	const recruiter = sanitize(res.locals.recruiterid)

	try {
		const delCount = await stepsModel.deleteOne({recruiter: recruiter, _id: stepid, company: company, job: job})
		if(delCount.deletedCount == 0){
			return res.sendStatus(400)
		}
	} catch (err) {
		return res.sendStatus(500)
	}

	try {
		let steps = await stepsModel.find({recruiter: recruiter, company: company, job: job})
		if(!steps){
			return res.sendStatus(400)
		}
	
		steps.forEach((step, index)=>{
			step.position = index + 1
			step.save()
		})	

	} catch (err) {
		return res.sendStatus(500)
	}	

	return res.json({'success': 'Etapa deletada'})
}


export async function editStep(req: Request, res: Response){
	const validResult = validationResult(req)
	if(!validResult.isEmpty()){
		return res.status(400).json({errros: validResult.array()})
	}

	const description = sanitize(req.body.description) as string
	const companyId = sanitize(req.body.company) as string
	const jobId = sanitize(req.body.job) as string
	const stepId = sanitize(req.body.step)
	const recruiter = sanitize(res.locals.recruiterid) as string

	try {
		const companyMatch = await companiesModel.findOne({_id: companyId, recruiter: recruiter})	
		if(!companyMatch){
			return res.sendStatus(400)
		}
	} catch (err) {
		return res.sendStatus(500)
	}	

	try {
		const jobMatch = await jobsModel.findOne({_id: jobId, company: companyId, recruiter: recruiter})	
		if(!jobMatch){
			return res.sendStatus(400)
		}
	} catch (err) {
		return res.sendStatus(500)
	}

	try {
		const step = await stepsModel.findOne({recruiter: recruiter, company: companyId, job: jobId, _id: stepId})
		if(!step){
			return res.sendStatus(400)
		}

		step.description = description
		await step.save()
	} catch (err) {
		return res.sendStatus(500)
	}

	return res.json({'success':'Etapa editada'})
}
