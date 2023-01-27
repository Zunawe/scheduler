import express from 'express'

import { api as controller } from '../controllers'

const router = express.Router()

router.put('/create', controller.createPut)
router.get('/event/:eventId', controller.eventGet)
router.put('/event/:eventId/participant', controller.eventParticipantPut)
router.delete('/event/:eventId/participant/:participantName', controller.eventParticipantDelete)

export { router }
