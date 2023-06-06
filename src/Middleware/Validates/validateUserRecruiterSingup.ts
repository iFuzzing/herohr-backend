import {body} from 'express-validator'
import { isPassword, isUsername } from '../../Utils/utils'

const validateUserRecruiterSingup = [
	body('email').notEmpty().isEmail().isLength({max: 42}).escape().withMessage('Email inválido'),
	body('password').notEmpty().isLength({min: 8, max: 32}).withMessage('Senha deve ter entre 8 a 32 caracteres').custom(async pass =>{
		if(!isPassword(pass)){
			throw new Error('Senha inválida. Deve ter pelo menos 1 número e 1 caracter especial (!@#$%^&*])')
		}	
	}),
	body('firstname').notEmpty().isLength({max: 32}).escape().custom(async name=>{
		if(!isUsername(name)){
			throw new Error('Primeiro nome inválido')
		}
	}),
	body('lastname').notEmpty().isLength({max: 32}).escape().custom(async name=>{
		if(!isUsername(name)){
			throw new Error('Segundo nome inválido')
		}
	})
]

export default validateUserRecruiterSingup
