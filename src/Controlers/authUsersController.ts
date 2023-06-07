import { Request, Response } from "express"
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import {recruiters as recruitersModel} from "./../Models/recruiters"
import {validationResult} from 'express-validator'

export async function userRecruiterSingup(req:Request, res:Response){
	
	const validResult = validationResult(req)
	if(!validResult.isEmpty()){
		return res.status(400).json({errors: validResult.array()})
	}

	const saltRounds = 8

	const email = req.body.email
	const password = await bcrypt.hash(req.body.password, saltRounds)
	const firstname = req.body.firstname
	const lastname = req.body.lastname
		
	const access_token_private:string = process.env.ACCESS_TOKEN_SECRET as string
	const access_token = jwt.sign(
	{
		'email': email,
		'firstname': firstname,
		'lastname': lastname
	},
	access_token_private,
	{expiresIn: '1d'}
	)
	
	const result = await recruitersModel.findOne({email: email})
	if(result){
		return res.status(409).json({'message':'email em uso'})
	}	
	
	try{
		recruitersModel.create({
			email: email,
			password: password,
			firstname: firstname,
			lastname: lastname,
			access_token: access_token
		})
	}catch(err){
		console.log(err)
		return res.sendStatus(500)
	}

	return res.json({'success':'Nova conta criada'})

}

export async function userRecruiterLogin(req:Request, res:Response){

	const validResult = validationResult(req)
	if(!validResult.isEmpty()){
		return res.status(400).json({erros: validResult.array()})
	}

	const email = req.body.email
	const password = req.body.password

	const recruiter = await recruitersModel.findOne({email: email})
	if(!recruiter){
		return res.json({'error':'Email ou senha incorreto'})
	}

	const passwordMatch = await bcrypt.compare(password, recruiter?.password?recruiter.password:'')
	console.log(passwordMatch)
	if(!passwordMatch){
		return res.json({'error':'Email ou senha incorreto'})
	}

	const access_token_private:string = process.env.ACCESS_TOKEN_SECRET as string
	const access_token = jwt.sign(
	{
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
	res.cookie('jwt',access_token, {httpOnly: true, maxAge: oneday})

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

			const recruiter = await recruitersModel.findOne({email: token_decoded.email, access_token: token})
			if(!recruiter){
				return res.sendStatus(400)
			}

			recruiter.access_token =  ''
			await recruiter.save()
			res.clearCookie('jwt')
			return res.json({'success':'Logout realizado'})
		}
	)
}
