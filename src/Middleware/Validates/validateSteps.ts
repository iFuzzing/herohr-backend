import {body, query} from 'express-validator'

const not_allowed_keywords:string[] = ['<script','<img','src=','alert(','onError','\' ||']

export const validateNewStep = [
	body('description').notEmpty().isLength({max: 150}).withMessage('A descrição deve ter no máximo 150 caracteres').custom(async (description: string)=>{
		not_allowed_keywords.forEach((word:string)=>{
			if(description.toLowerCase().indexOf(word)!=-1){
				// Todo: registrar no log de possíveis ataques
				throw new Error('Descrição potencialmente perigosa. Admin notificado.')
			}	
		})
		
	}).escape(),
	body('company').notEmpty().isLength({min: 15, max: 24}).withMessage('Empresa inválida').escape(),
	body('job').notEmpty().isLength({min: 15, max: 24}).withMessage('Trabalho inválido').escape()
]

export const validateDeleteStep = [
	query('step').notEmpty().isLength({min: 15, max: 24}).withMessage('Etapa inválida').escape(),
	query('company').notEmpty().isLength({min: 15, max: 24}).withMessage('Empresa inválida').escape(),
	query('job').notEmpty().isLength({min: 15, max: 24}).withMessage('Trabalho inválido')
	
]
