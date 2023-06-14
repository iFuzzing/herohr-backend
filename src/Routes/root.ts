import express, {Request, Response} from 'express'
import multer from 'multer'
import {storage} from './../Models/multerConfig'

import {userRecruiterSingup, userRecruiterLogin, userRecruiterLogout} from './../Controlers/authUsersController'
import { newCompany, getCompanies, deleteCompany, editCompany, getCompany } from '../Controlers/companiesController'
import { protectedRoute } from '../Controlers/controller.test'

import routeProtection from '../Middleware/Protections/routeProtection'
import imageUploadProtection from '../Middleware/Protections/imageUploadProtection'

import { validateNewCompany } from '../Middleware/Validates/validateCompanies'
import {validateUserRecruiterLogin, validateUserRecruiterSingup} from './../Middleware/Validates/validateAuthUsers'

const upload = multer({storage: storage, limits: {fileSize: 1024*1000}}).single('image')
const router = express.Router()

router.post('/api/recruiter/singup', validateUserRecruiterSingup, userRecruiterSingup)
router.post('/api/recruiter/login', validateUserRecruiterLogin, userRecruiterLogin)
router.get('/api/recruiter/logout', userRecruiterLogout)
router.get('/api/recruiter/auth', routeProtection, (req:Request, res:Response)=>{return res.sendStatus(200)})

router.post('/api/recruiter/companies/new', routeProtection, (req:Request, res:Response, next:any)=>{
   upload(req, res, (err)=>{
      if(err instanceof multer.MulterError){
         return res.sendStatus(400)
      }
      next()
   })
},imageUploadProtection, validateNewCompany, newCompany)
router.get('/api/recruiter/companies/delete', routeProtection, deleteCompany)
router.post('/api/recruiter/companies/edit', routeProtection, (req:Request, res:Response, next:any)=>{
   upload(req, res, (err)=>{
      if(err instanceof multer.MulterError){
         return res.sendStatus(400)
      }
      next()
   })

}, imageUploadProtection, validateNewCompany, editCompany)

router.get('/api/recruiter/companies', routeProtection, getCompanies)
router.get('/api/recruiter/company', routeProtection, getCompany)


router.get('/api/protected', routeProtection, protectedRoute) // Rota de teste

export default router

