import { Request, Response } from "express"
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import {recruiters as recruitersModel} from "./../Models/recruiters"
import {validationResult} from 'express-validator'

export const userRecruiterSingup = async function userRecruiterSingup(req:Request, res:Response){
	
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
		return res.status(500)
	}

	return res.json({'success':'Nova conta criada'})

}
