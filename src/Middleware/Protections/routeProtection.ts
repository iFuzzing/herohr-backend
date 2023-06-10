import { Response, Request } from 'express'
import jwt from 'jsonwebtoken'
import {recruiters as recruiterModel} from './../../Models/recruiters'

export default async function routeProtection(req:Request, res:Response, next:any){

	const token = req.cookies?.jwt?req.cookies.jwt:null
	if(!token){
		return res.sendStatus(401)
	}

	const access_token_private: string = process.env.ACCESS_TOKEN_SECRET as string
	try {
		const token_decoded:any = jwt.verify(token, access_token_private)
		if(!token_decoded){
			return res.sendStatus(401)
		}
		const token_email = token_decoded?.email?token_decoded.email as string:''
		const recruiter = await recruiterModel.findOne({email: token_email, access_token: token})	
		if(!recruiter){
			return res.sendStatus(401)
		}
		
		res.locals.recruiterid = recruiter.id
	} catch (error) {
		return res.sendStatus(401)
	}

	next()
}
