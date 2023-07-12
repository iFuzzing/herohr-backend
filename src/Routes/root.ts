import express, {Request, Response} from 'express'
import {userRecruiterSingup, userRecruiterLogin, userRecruiterLogout} from './../Controlers/authUsersController'
import { protectedRoute } from '../Controlers/controller.test'
import {validateUserRecruiterLogin, validateUserRecruiterSingup} from './../Middleware/Validates/validateAuthUsers'
import routeProtection from '../Middleware/Protections/routeProtection'
import companiesRoute from './companies'
import jobsRoute from './jobs'
import stepsRoute from './steps'
import applicantsRoute from './applicants'

const router = express.Router()

router.post('/api/recruiter/singup', validateUserRecruiterSingup, userRecruiterSingup)
router.post('/api/recruiter/login', validateUserRecruiterLogin, userRecruiterLogin)
router.get('/api/recruiter/logout', userRecruiterLogout)
router.get('/api/recruiter/auth', routeProtection, (req:Request, res:Response)=>{return res.sendStatus(200)})

router.use('/api/recruiter/companies', routeProtection, companiesRoute)
router.use('/api/recruiter/jobs', routeProtection, jobsRoute)
router.use('/api/recruiter/steps', routeProtection, stepsRoute)

router.use('/api/applicant', applicantsRoute)

router.get('/api/protected', routeProtection, protectedRoute) // Rota de teste

export default router

