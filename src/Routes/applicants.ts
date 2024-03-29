import express, { Request, Response } from 'express'
import { validateChangeStepApplicant, validateDeleteApplicantRef, validateGetApplicantRef, validateGetApplicantsRef, validateNewApplicantRef } from '../Middleware/Validates/validateApplicants'
import routeProtection from '../Middleware/Protections/routeProtection'
import { addtagApplicant, deleteApplicantRef, deltagApplicant, editApplicantRef, getApplicantRef, getApplicantsLinking, getTags, newApplicantRef, nextStepApplicant, prevStepApplicant } from '../Controlers/applicantsController'
import multer from 'multer'
import imageUploadProtection from '../Middleware/Protections/imageUploadProtection'
import {storage} from './../Models/multerConfig'

const router = express.Router()
const upload = multer({storage: storage, limits: {fileSize: 1024*1000}}).single('image')

router.get('/', routeProtection, validateGetApplicantRef, getApplicantRef)
router.get('/linking', routeProtection, validateGetApplicantsRef, getApplicantsLinking)
router.get('/delete/ref', routeProtection, validateDeleteApplicantRef, deleteApplicantRef)
router.get('/nextstep', routeProtection, validateChangeStepApplicant, nextStepApplicant)
router.get('/prevstep', routeProtection, validateChangeStepApplicant, prevStepApplicant)
router.get('/addtag', routeProtection, addtagApplicant) // TODO: validação
router.get('/deltag', routeProtection, deltagApplicant) // TODO: validação
router.get('/tags', routeProtection, getTags)

router.post('/new/ref',(req: Request, res: Response, next:any)=>{
   upload(req, res, (err:any)=>{
      if(err instanceof multer.MulterError){
         return res.sendStatus(400)
      }
      next()
   })
}, imageUploadProtection, routeProtection, validateNewApplicantRef, newApplicantRef)

router.post('/edit/ref',(req: Request, res: Response, next:any)=>{
   upload(req, res, (err:any)=>{
      if(err instanceof multer.MulterError){
         return res.sendStatus(400)
      }
      next()
   })
}, imageUploadProtection, routeProtection, validateNewApplicantRef, editApplicantRef)

export default router
