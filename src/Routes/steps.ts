import express from 'express'
import { deleteStep, editStep, getStep, getSteps, newStep } from '../Controlers/stepsController'
import { validateDeleteStep, validateNewStep } from '../Middleware/Validates/validateSteps'
const router = express.Router()

router.get('/', getSteps)
router.get('/step', getStep)
router.get('/delete', validateDeleteStep, deleteStep)
router.post('/new', validateNewStep, newStep)
router.post('/edit', validateNewStep, editStep)


export default router
