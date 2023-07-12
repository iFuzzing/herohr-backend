import express, { Request, Response } from 'express'
import { validateNewApplicantRef } from '../Middleware/Validates/validateApplicants'
import routeProtection from '../Middleware/Protections/routeProtection'
import { getApplicants, newApplicantRef } from '../Controlers/applicantsController'
import multer from 'multer'
import imageUploadProtection from '../Middleware/Protections/imageUploadProtection'
import {storage} from './../Models/multerConfig'

const router = express.Router()
const upload = multer({storage: storage, limits: {fileSize: 1024*1000}}).single('image')

router.get('/', routeProtection, getApplicants)

router.post('/new/ref',(req: Request, res: Response, next:any)=>{
   upload(req, res, (err:any)=>{
      if(err instanceof multer.MulterError){
         return res.sendStatus(400)
      }
      next()
   })
}, imageUploadProtection, routeProtection, validateNewApplicantRef, newApplicantRef)

export default router