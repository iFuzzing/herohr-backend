import express from 'express'
import { deleteJob, editJob, getJob, getJobs, newJob } from '../Controlers/jobsController'
import { validateNewJob } from '../Middleware/Validates/validateJobs'

const router = express.Router()

router.get('/', getJobs)
router.get('/job', getJob)
router.post('/new', validateNewJob, newJob)
router.get('/delete', deleteJob)
router.post('/edit', validateNewJob, editJob)

export default router
