import express from 'express'
import {userRecruiterSingup} from './../Controlers/authUsersController'
import modeltest from './../Models/model.test'

const router = express.Router()

router.get('/api/hello_world', async (req, res)=>{
	try {
		await modeltest.create({
			userTest: 'Its work!'
		})
	} catch (error) {
		console.log(error)
		return res.status(500).json({'message':'Houve um falha por parte do servidor'})
	}

	res.json({'message':'Hello world!'})
})

router.post('/api/singup', userRecruiterSingup)

export default router
