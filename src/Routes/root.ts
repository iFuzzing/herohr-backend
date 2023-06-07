import express, {Request, Response} from 'express'
import {userRecruiterSingup, userRecruiterLogin, userRecruiterLogout} from './../Controlers/authUsersController'
import modeltest from './../Models/model.test'
import {validateUserRecruiterLogin, validateUserRecruiterSingup} from './../Middleware/Validates/validateAuthUsers'
import routeProtection from '../Middleware/Protections/routeProtection'
import protectedRoute from '../Controlers/controller.test'
const router = express.Router()

router.get('/api/hello_world', async (req, res)=>{
	try {
		await modeltest.create({
			userTest: 'Its work!'
		})
	} catch (error) {
		console.log(error)
		return res.status(500)
	}

	res.json({'message':'Hello world!'})
})

router.post('/api/recruiter/singup', validateUserRecruiterSingup, userRecruiterSingup)
router.post('/api/recruiter/login', validateUserRecruiterLogin, userRecruiterLogin)
router.get('/api/recruiter/logout', userRecruiterLogout)
router.get('/api/recruiter/auth', routeProtection, (req:Request, res:Response)=>{return res.sendStatus(200)})
router.get('/api/protected', routeProtection, protectedRoute)

export default router
