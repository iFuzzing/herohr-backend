import {Request, Response} from 'express'
import sanitize from 'mongo-sanitize'
import { clearTempFile } from '../Utils/utils'
import { applicants as applicantsModel } from '../Models/applicants'
import { validationResult } from 'express-validator'
import { linking as linkingModel } from '../Models/linking'
import { jobs as jobsModel } from '../Models/jobs'
import path from 'path'
import {steps as stepsModel} from '../Models/steps'

type tagsType = {
	text: string,
	color: string
}

async function newLinking(recruiter: string, job: string, applicant: string, applicant_name: string, applicant_pic: string,  status: string, tags: tagsType[]){

	try{
		await linkingModel.create({
			recruiter: recruiter,
			job: job,
			applicant: applicant,
			applicant_name: applicant_name,
			applicant_pic: applicant_pic,
			status: status,
			tags: tags,
			step: 1

		})
	}catch(err){
		console.log(err)
		return false
	}
	
	return true
}

async function deleteLinking(recruiter: string, linking: string){
	try {
		await linkingModel.deleteOne({recruiter: recruiter, _id: linking})
	} catch (err) {
		return false
	}

	return true
}

export async function getApplicantsLinking(req: Request, res: Response){

	const validResult = validationResult(req)
	if(!validResult.isEmpty()){
		return res.status(400).json(validResult.array())
	}

	const recruiter = sanitize(res.locals.recruiterid) as string
	const step = sanitize(req.query.step) as string
	const job = sanitize(req.query.job) as string

	try {
		const jobMatch = await jobsModel.findOne({recruiter: recruiter, _id: job})	
		
		if(!jobMatch){
			return res.status(400).json({'error':'Trabalho inválido'})
		}

	} catch (err) {
		console.log(err)
		return res.status(500).json({'error':'Trabalho inválido'})
	}

	let linking
	try {
		if(step){
			linking = await linkingModel.find({recruiter: recruiter, job: job, step: step})
		}else{
			linking = await linkingModel.find({recruiter: recruiter, job: job})
		}

	} catch (err) {
		return res.sendStatus(500)
	}

	return res.json(linking)
}

async function delApplicantRef(recruiter: string, applicantref: string){
	try {
		const applicant = await applicantsModel.findOne({recruiter: recruiter, _id: applicantref})
		if(!applicant){
			return false
		}
		await applicantsModel.deleteOne({recruiter: recruiter,  _id: applicantref})
		await linkingModel.deleteOne({recruiter: recruiter, applicant: applicantref})
		clearTempFile(path.join(__dirname,'..','..','public','uploads', applicant.picture))
	} catch (err) {
		return false	
	}

	return true
}

export async function deleteApplicantRef(req: Request, res: Response){

	const validResult = validationResult(req)
	if(!validResult.isEmpty()){
		return res.status(400).json(validResult.array())
	}
	const recruiter = sanitize(res.locals.recruiterid) as string
	const applicant = sanitize(req.query.id) as string

	if(!await delApplicantRef(recruiter, applicant)){
		return res.sendStatus(400)
	}

	return res.json({'success':'Candidato deletado'})
}

export async function nextStepApplicant(req: Request, res: Response){
	
	const validResult = validationResult(req)
	if(!validResult.isEmpty()){
		return res.status(400).json(validResult.array())
	}

	const recruiter = sanitize(res.locals.recruiterid) as string
	const applicant = sanitize(req.query.applicant) as string
	const job = sanitize(req.query.job) as string 

	let step
	try {
		step = await  stepsModel.find({recruiter: recruiter, job: job})
		if(!step){
			return res.sendStatus(400)
		}
	} catch (err) {
		return res.sendStatus(500)
	}

	let link
	try {
		link = await linkingModel.findOne({recruiter: recruiter, applicant: applicant})		
		if(!link){
			return res.sendStatus(400)
		}
	} catch (err) {
		return res.sendStatus(500)
	}


	try {
		if(link.step == step.length){
			return res.status(400).json({'error':'Esse candidato já está na última etapa'})
		}

		link.step = link.step + 1	
		link.save()
	} catch (err) {
		return res.sendStatus(500) 	
	}

	return res.json({'success':'O candidato avançou uma etapa'})
}

export async function prevStepApplicant(req: Request, res: Response){
	
	const validResult = validationResult(req)
	if(!validResult.isEmpty()){
		return res.status(400).json(validResult.array())
	}

	const recruiter = sanitize(res.locals.recruiterid) as string
	const applicant = sanitize(req.query.applicant) as string
	const job = sanitize(req.query.job) as string 

	let step
	try {
		step = await  stepsModel.find({recruiter: recruiter, job: job})
		if(!step){
			return res.sendStatus(400)
		}
	} catch (err) {
		return res.sendStatus(500)
	}

	let link
	try {
		link = await linkingModel.findOne({recruiter: recruiter, applicant: applicant})		
		if(!link){
			return res.sendStatus(400)
		}
	} catch (err) {
		return res.sendStatus(500)
	}


	try {
		if(link.step <= 0){
			return res.status(400).json({'error':'Esse candidato já está na primeira etapa'})
		}

		link.step = link.step - 1	
		link.save()
	} catch (err) {
		return res.sendStatus(500) 	
	}

	return res.json({'success':'O candidato voltou uma etapa'})
}

export async function getApplicantRef(req: Request, res: Response){
	const recruiter = sanitize(res.locals.recruiterid) as string
	const job = sanitize(req.query.job) as string
	const applicantId = sanitize(req.query.id) as string

	try {
		const linked = await linkingModel.findOne({recruiter: recruiter, job: job, applicant: applicantId})
		if(!linked){
			return res.sendStatus(400)
		}
	} catch (err) {
		return res.sendStatus(500)
	}


	let applicant
	try {
		applicant = await applicantsModel.findOne({_id: applicantId}).select('-recruiter')
	} catch (err) {
		return res.sendStatus(500)
	}

	return res.json(applicant)

}

export async function newApplicantRef(req: Request, res: Response){

	const pic: string = req?.file?.path.replace('temp_uploads','uploads') + '.png' as string
	const pic_name: string = req?.file?.filename + '.png' as string

	const validResult = validationResult(req)
	if(!validResult.isEmpty()){
		clearTempFile(pic)
		console.log(validResult.array())
		return res.status(400).json({erros: validResult.array()})
	}
	const recruiter = sanitize(res.locals.recruiterid) as string
	const name = sanitize(req.body.name) as string
	const aboutme = sanitize(req.body.aboutme) as string
	const portfolio = sanitize(req.body.portfolio) as string
	const job = sanitize(req.body.job) as string
	
	let contact
	let skills
	try{
		contact = JSON.parse(sanitize(req.body.contact))
		skills = JSON.parse(sanitize(req.body.skills))
	}catch(err){
		clearTempFile(pic)
		return res.sendStatus(400)
	}

	let applicant
	try {
		applicant = await applicantsModel.create(
			{
				recruiter: recruiter,
				name: name,
				aboutme: aboutme,
				portfolio: portfolio,
				picture: pic_name,
				contact: contact,
				skills: skills
			}
		)	
	} catch (err) {
		clearTempFile(pic)
		return res.sendStatus(500)
	}

	try {
		const jobMatch = await jobsModel.findOne({recruiter: recruiter, _id: job})	
		
		if(!jobMatch){
			clearTempFile(pic)
			delApplicantRef(recruiter, applicant._id.toString())
			return res.status(400).json({'error':'Trabalho inválido'})
		}

	} catch (err) {
		clearTempFile(pic)
		delApplicantRef(recruiter, applicant._id.toString())
		return res.status(500).json({'error':'Trabalho inválido'})
	}

	if(! await newLinking(recruiter, job, applicant._id.toString(), applicant.name, applicant.picture,  'ativo', [])){
		clearTempFile(pic)
		delApplicantRef(recruiter, applicant._id.toString())
		return res.status(500).json({'error':'Trabalho inválido'})	
	}

	return res.json({'success':'Novo candidato criado'})	
}

export async function editApplicantRef(req: Request, res: Response){

	const pic: string = req?.file?.path.replace('temp_uploads','uploads') + '.png' as string
	const pic_name: string = req?.file?.filename + '.png' as string

	const validResult = validationResult(req)
	if(!validResult.isEmpty()){
		clearTempFile(pic)
		console.log(validResult.array())
		return res.status(400).json({erros: validResult.array()})
	}
	const recruiter = sanitize(res.locals.recruiterid) as string
	const name = sanitize(req.body.name) as string
	const aboutme = sanitize(req.body.aboutme) as string
	const portfolio = sanitize(req.body.portfolio) as string
	const applicantId = sanitize(req.body.applicant) as string

	let contact
	let skills
	try{
		contact = JSON.parse(sanitize(req.body.contact))
		skills = JSON.parse(sanitize(req.body.skills))
	}catch(err){
		clearTempFile(pic)
		return res.sendStatus(400)
	}

	let applicant
	try {
		applicant = await applicantsModel.findOne({_id: applicantId, recruiter: recruiter})
		if(!applicant){
			return res.sendStatus(400)
		}
	} catch (err) {
		return res.sendStatus(500)
	}
	
	try {
		applicant.name = name
		applicant.aboutme = aboutme
		applicant.portfolio = portfolio
		applicant.skills = skills
		applicant.contact = contact
		applicant.picture = pic_name
		applicant.save()
	} catch (err) {
		return res.sendStatus(500)
	}

	let link
	try {
		link = await linkingModel.findOne({applicant: applicant._id, recruiter: recruiter})
	} catch (err) {
		return res.sendStatus(500)	
	}

	try {
		if(link!=null){
			link.applicant_name = applicant.name
			link.applicant_pic = applicant.picture
			link.save()
		}
		
	} catch (err) {
		return res.sendStatus(500)		
	}

	return res.json({'success':'Candidato editado'})	
}

