import { Response, Request } from 'express'
import jwt from 'jsonwebtoken'
import {recruiters as recruiterModel} from './../../Models/recruiters'

export default function routeProtection(req:Request, res:Response, next:any){

	const token = req.cookies?.jwt?req.cookies.jwt:null
	if(!token){
		return res.sendStatus(401)
	}

	const access_token_private: string = process.env.ACCESS_TOKEN_SECRET as string
	jwt.verify(
		token,
		access_token_private,
		async (err:any, token_decoded:any)=>{
			if(err){
				return res.sendStatus(401)
			}
			
			const recruiter = await recruiterModel.findOne({email: token_decoded.email, access_token: token})	
			if(!recruiter){
				return res.sendStatus(401)
			}

			next()
		}
	)
}
