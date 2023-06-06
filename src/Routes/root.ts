import express from 'express'
import {userRecruiterSingup} from './../Controlers/authUsersController'
import modeltest from './../Models/model.test'
import validateUserRecruiterSingup from './../Middleware/Validates/validateUserRecruiterSingup'
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

router.post('/api/recruiter/singup',validateUserRecruiterSingup, userRecruiterSingup)

export default router
