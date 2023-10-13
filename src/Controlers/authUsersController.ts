import { Request, Response } from "express"
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import {recruiters as recruitersModel} from "./../Models/recruiters"
import {validationResult} from 'express-validator'
import sanitize from 'mongo-sanitize'

export async function userRecruiterSingup(req:Request, res:Response){

	const token = req.cookies?.jwt?req.cookies.jwt:null
	let isTokenValid = false
	if(token){
		const access_token_private: string = process.env.ACCESS_TOKEN_SECRET as string
		try {
			const token_decoded:any = jwt.verify(token, access_token_private)
			if(token_decoded){
				const token_email = token_decoded?.email?token_decoded.email as string:''
				const recruiter = await recruitersModel.findOne({email: token_email, access_token: token})	
				if(recruiter){
					isTokenValid = true
				}	
			}

		} catch (error) {
			
		}	
	}

	if(isTokenValid){
		return res.sendStatus(400)
	}

	const validResult = validationResult(req)
	if(!validResult.isEmpty()){
		return res.status(400).json({errors: validResult.array()})
	}

	const saltRounds = 8

	const email = sanitize(req.body.email)
	const password = await bcrypt.hash(req.body.password, saltRounds)
	const firstname = sanitize(req.body.firstname)
	const lastname = sanitize(req.body.lastname)

	const result = await recruitersModel.findOne({email: email})
	if(result){
		return res.status(409).json({'message':'email em uso'})
	}	

	let recruiter
	try{
		recruiter = await recruitersModel.create({
			email: email,
			password: password,
			firstname: firstname,
			lastname: lastname,
			access_token: ' '
		})
	}catch(err){
		return res.sendStatus(500)
	}

	const access_token_private:string = process.env.ACCESS_TOKEN_SECRET as string
	const access_token = jwt.sign(
	{
		'id': recruiter.id,
		'email': email,
		'firstname': firstname,
		'lastname': lastname
	},
	access_token_private,
	{expiresIn: '1d'}
	)

	recruiter.access_token = access_token
	await recruiter.save()

	const oneday = 24 * 60 * 60 * 1000 
	res.cookie('jwt',access_token, {httpOnly: true, maxAge: oneday})

	return res.json({'success':'Nova conta criada'})
}

export async function userRecruiterLogin(req:Request, res:Response){
	
	const token = req.cookies?.jwt?req.cookies.jwt:null
	let isTokenValid = false
	if(token){
		const access_token_private: string = process.env.ACCESS_TOKEN_SECRET as string
		try {
			const token_decoded:any = jwt.verify(token, access_token_private)
			if(token_decoded){
				const token_email = sanitize(token_decoded?.email?token_decoded.email as string:'')
				const recruiter = await recruitersModel.findOne({email: token_email, access_token: token})	
				if(recruiter){
					isTokenValid = true
				}	
			}

		} catch (error) {
			//console.log(error)	
		}	
	}

	if(isTokenValid){
		return res.sendStatus(400)
	}


	const validResult = validationResult(req)
	if(!validResult.isEmpty()){
		return res.status(400).json({erros: validResult.array()})
	}

	const email = sanitize(req.body.email)
	const password = sanitize(req.body.password)

	const recruiter = await recruitersModel.findOne({email: email})
	if(!recruiter){
		return res.json({'error':'Email ou senha incorreto'})
	}

	const passwordMatch = await bcrypt.compare(password, recruiter?.password?recruiter.password:'')
	if(!passwordMatch){
		return res.json({'error':'Email ou senha incorreto'})
	}

	const access_token_private:string = process.env.ACCESS_TOKEN_SECRET as string
	const access_token = jwt.sign(
	{
		'id': recruiter.id,
		'email': recruiter.email,
		'firstname': recruiter.firstname,
		'lastname': recruiter.lastname
	},
	access_token_private,
	{expiresIn: '1d'}
	)

	recruiter.access_token = access_token
	recruiter.last_access = Date.now().toString()
	await recruiter.save()

	const oneday = 24 * 60 * 60 * 1000 
	res.cookie('jwt',access_token, {httpOnly: false, maxAge: oneday})

	res.json({'success':'Usuário logado'})
}

export async function userRecruiterLogout(req:Request, res:Response){

	const token = req.cookies?.jwt?req.cookies.jwt:null
	if(!token){
		return res.sendStatus(400)
	}

	const access_token_secret: string = process.env.ACCESS_TOKEN_SECRET as string
	jwt.verify(
		token,
		access_token_secret,
		async (err:any, token_decoded:any)=>{
			if(err){
				return res.sendStatus(400)
			}

			const token_email = sanitize(token_decoded.email)
			const recruiter = await recruitersModel.findOne({email: token_email, access_token: token})
			if(!recruiter){
				return res.sendStatus(400)
			}

			recruiter.access_token =  ' '
			await recruiter.save()
			res.clearCookie('jwt')
			return res.json({'success':'Logout realizado'})
		}
	)
}

export async function getRecruiterName(req: Request, res: Response){
	const recruiterid = sanitize(res.locals.recruiterid)
	const recruiter = await recruitersModel.findOne({_id: recruiterid})
	if(!recruiter){
		return res.sendStatus(400)
	}

	return res.json({'name': `${recruiter.firstname} ${recruiter.lastname}`})
} 