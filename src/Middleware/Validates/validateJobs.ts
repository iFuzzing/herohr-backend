import {body} from 'express-validator'

const not_allowed_keywords:string[] = ['<script','<img','src=','alert(','onError','\' ||']

export const validateNewJob = [
	body('name').notEmpty().isLength({max: 42}).withMessage('O nome da empresa deve ter no máximo 42 caracteres').custom(async(name: string)=>{
		not_allowed_keywords.forEach(word=>{
			if(name.toLowerCase().indexOf(word)!=-1){
				// Todo: registrar no log de possíveis ataques
				throw new Error('Nome potencialmente perigoso. Admin notificado.')
			}	
		})
	}).escape(),
	body('description').notEmpty().isLength({max: 250}).withMessage('A descrição deve ter no máximo 250 caracteres').custom(async (description: string)=>{
		not_allowed_keywords.forEach((word:string)=>{
			if(description.toLowerCase().indexOf(word)!=-1){
				// Todo: registrar no log de possíveis ataques
				throw new Error('Descrição potencialmente perigosa. Admin notificado.')
			}	
		})
		
	}).escape()
]
