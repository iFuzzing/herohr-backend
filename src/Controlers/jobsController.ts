import {Request, Response} from 'express'
import {jobs as jobsModel} from './../Models/jobs'
import { companies as companiesModel } from '../Models/companies'
import sanitize from 'mongo-sanitize'
import { validationResult } from 'express-validator'

export async function getAllJobs(req: Request, res: Response){
	const recruiter = sanitize(res.locals.recruiterid)
	
	let jobs:any
	try {
		jobs = await jobsModel.find({recruiter: recruiter})
	} catch (err) {
		return res.sendStatus(500)
	}

	return res.json(jobs)
}

export async function getJobs(req: Request, res: Response){
	const companyId = sanitize(req.query.company) as string
	const recruiter = sanitize(res.locals.recruiterid)
	
	if(!companyId || companyId.length < 15 || companyId.length> 24){
		return res.sendStatus(400)
	}

	let jobs:any
	try {
		jobs = await jobsModel.find({recruiter: recruiter, company: companyId}).select('_id name description').sort({created_at: -1})
	} catch (err) {
		return res.sendStatus(500)
	}

	return res.json(jobs)
}

export async function getJob(req: Request, res: Response){
	const companyId = sanitize(req.query.company) as string
	const jobId = sanitize(req.query.job) as string
	const recruiter = sanitize(res.locals.recruiterid) as string
	

	if(!companyId || companyId.length < 15 || companyId.length> 24 || jobId.length < 15 || jobId.length > 24){
		return res.sendStatus(400)
	}

	let job:any
	try {
		job = await jobsModel.findOne({_id: jobId, company: companyId, recruiter: recruiter}).select('_id name description')	
		if(!job){
			return res.sendStatus(400)
		}
	} catch (err) {
		return res.sendStatus(500)
	}

	return res.json(job)
}

export async function editJob(req: Request, res: Response){
	
	const validResult = validationResult(req)
	if(!validResult.isEmpty()){
		return res.status(400).json({erros: validResult.array()})
	}

	const companyId = sanitize(req.body.company) as string
	const jobId = sanitize(req.body.job) as string
	const recruiter = sanitize(res.locals.recruiterid) as string
	const name = sanitize(req.body.name) as string
	const description = sanitize(req.body.description) as string

	if(jobId.length < 15 || jobId.length > 24 || companyId.length < 15 || companyId.length > 24){
		res.sendStatus(400)
	}

	try {
		const companyMatch = await companiesModel.findOne({_id: companyId, recruiter: recruiter})
		if(!companyMatch){
			return res.sendStatus(400)
		}
	} catch (err) {
		return res.sendStatus(500)		
	}

	let job:any
	try {
		job = await jobsModel.findOne({_id: jobId, recruiter: recruiter})
		if(!job){
			return res.sendStatus(400)
		}

		job.name = name
		job.description = description
		await job.save()

	} catch (err) {
		return res.sendStatus(500)
	}

	return res.json({'success':'Trabalho editado'})
}

export async function newJob(req: Request, res: Response){

	const validResult = validationResult(req)
	if(!validResult.isEmpty()){
		return res.status(400).json({erros: validResult.array()})
	}

	const name = sanitize(req.body.name)
	const description = sanitize(req.body.description)
	const companyId = sanitize(req.body.company)
	const recruiter = sanitize(res.locals.recruiterid)
	
	try {
		const companyMatch = await companiesModel.findOne({_id: companyId, recruiter: recruiter})
		if(!companyMatch){
			console.log('Company id: ', companyId, ' recruiter: ',recruiter)
			return res.sendStatus(400)
		}
	} catch (err) {
		return res.sendStatus(500)
	}


	try {
		await jobsModel.create({company: companyId, recruiter: recruiter, name: name, description: description})	
	} catch (err) {
		return res.sendStatus(500)	
	}

	return res.json({'success':'Trabalho registrado'})
}

export async function deleteJob(req: Request, res: Response){	

	const companyId = sanitize(req.query.company) as string
	const jobId = sanitize(req.query.job) as string
	const recruiter = sanitize(res.locals.recruiterid) as string

	if(!companyId || !jobId || !recruiter){
		return res.sendStatus(400)
	}

	try {
		const companyMatch = await companiesModel.findOne({_id: companyId, recruiter: recruiter})
		if(!companyMatch){
			return res.sendStatus(400)
		}
	} catch (err) {
		return res.sendStatus(500)
	}

	try {
		const deletedCount = await jobsModel.deleteOne({_id: jobId})	
		if(deletedCount.deletedCount  == 0){
			return res.sendStatus(400)
		}
	} catch (err) {
		return res.sendStatus(500)
	}

	return res.json({'success':'Trabalho deletado'})
} 
