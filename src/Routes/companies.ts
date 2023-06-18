import express, {Request, Response} from 'express'
import multer from 'multer'
import { newCompany, getCompanies, deleteCompany, editCompany, getCompany } from '../Controlers/companiesController'
import imageUploadProtection from '../Middleware/Protections/imageUploadProtection'
import { validateNewCompany } from '../Middleware/Validates/validateCompanies'
import {storage} from './../Models/multerConfig'

const router = express.Router()
const upload = multer({storage: storage, limits: {fileSize: 1024*1000}}).single('image')

router.get('/', getCompanies)
router.get('/company', getCompany)
router.get('/delete', deleteCompany)

router.post('/new', (req:Request, res:Response, next:any)=>{
   upload(req, res, (err:any)=>{
      if(err instanceof multer.MulterError){
         return res.sendStatus(400)
      }
      next()
   })
},imageUploadProtection, validateNewCompany, newCompany)

router.post('/edit', (req:Request, res:Response, next:any)=>{
   upload(req, res, (err)=>{
      if(err instanceof multer.MulterError){
         return res.sendStatus(400)
      }
      next()
   })

}, imageUploadProtection, validateNewCompany, editCompany)

export default router
