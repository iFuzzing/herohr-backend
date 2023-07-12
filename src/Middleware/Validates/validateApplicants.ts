import { body } from "express-validator"
import { isEmail, isUsername, validateGitHubProfile, validateLinkedInProfile, validatePhoneNumber } from "../../Utils/utils"

type Skill = {
	'skill': string,
	'value': number
}

type ContactType = {
	email: string,
	linkedin: string,
	phone: string,
	github: string
}

const not_allowed_keywords:string[] = ['<script','<img','src=','alert(','onError','\' ||']

export const validateNewApplicantRef = [
	body('job').notEmpty().isLength({min: 15, max: 24}).withMessage('Trabalho inválido').escape(),
	body('name').notEmpty().isLength({max: 42}).withMessage('O nome deve ter no máximo 42 caracteres').custom(async(name: string)=>{
	
		if(!isUsername(name)){
			throw new Error('Nome inválido')
		}

		not_allowed_keywords.forEach(word=>{
			if(name.toLowerCase().indexOf(word)!=-1){
				// Todo: registrar no log de possíveis ataques
				throw new Error('Nome potencialmente perigoso. Admin notificado.')
			}	
		})
	}).escape(),
	body('portfolio').isLength({max: 150}).withMessage('O portfolio deve ter no máximo 150 caracteres').custom(async(portfolio: string)=>{
	
		not_allowed_keywords.forEach(word=>{
			if(portfolio.toLowerCase().indexOf(word)!=-1){
				// Todo: registrar no log de possíveis ataques
				throw new Error('Portfolio potencialmente perigoso. Admin notificado.')
			}	
		})

		if(portfolio && !portfolio.startsWith('http')){
			throw new Error('Portfólio inválido')
		}

	}),
	body('aboutme').isLength({max: 450}).withMessage('Sobre mim deve ter no máximo 450 caracteres').custom(async (aboutme: string)=>{
		not_allowed_keywords.forEach((word:string)=>{
			if(aboutme.toLowerCase().indexOf(word)!=-1){
				// Todo: registrar no log de possíveis ataques
				throw new Error('Sobre mim potencialmente perigoso. Admin notificado.')
			}	
		})
		
	}).escape(),
	body('contact').custom(async (contact: string)=>{
		let contactinfo: ContactType
		if(contact){
			try {
				contactinfo = JSON.parse(contact)
			} catch (err) {
				throw new Error('Formatação incorreta')
			}

			if(typeof(contactinfo.email) == "undefined" || typeof(contactinfo.linkedin) == "undefined" || typeof(contactinfo.phone) == "undefined" || typeof(contactinfo.github)=="undefined"){
				throw new Error('Todos os campos de contato precisam existir (mesmo que vazio)')
			}

			const email = contactinfo?.email as string
			const linkedin = contactinfo?.linkedin as string
			const phone = contactinfo?.phone as string
			const github = contactinfo?.github as string

			if(email && !isEmail(email)){
				throw new Error('Email de contato inválido')
			}	
		
			if(linkedin && !validateLinkedInProfile(linkedin)){
				throw new Error('Linkedin inválido')
			}		

			if(phone && !validatePhoneNumber(phone)){
				throw new Error('Número de contato inválido')
			}

			if(github && !validateGitHubProfile(github)){
				throw new Error('Github inválido')
			}	

		}else{
			throw new Error('Formatação incorreta em algum campo de contato')
		}

	}),
	body('skills').custom(async (skills: string)=>{
		let skillsinfo:Array<Skill> = [] as Array<Skill>
		if(skills){
			try {
				skillsinfo = JSON.parse(skills)
			} catch (err) {
				throw new Error('Formatação incorreta')		
			}

			 skillsinfo.map(skill=>{

				not_allowed_keywords.forEach((word:string)=>{
					if(skill.skill.toLowerCase().indexOf(word)!=-1){
						// Todo: registrar no log de possíveis ataques
						throw new Error('Campo habilidade potencialmente perigoso. Admin notificado.')
					}	
				})

				if(skill.skill.length > 32){
					throw new Error('Habilidade deve ter no máximo 32 caracteres')		

				}

				if(skill.value < 0 || skill.value > 10){
					throw new Error('O valor da habilidade deve estar entre 0 e 10')		

				}
			})
		}

	})
] 
