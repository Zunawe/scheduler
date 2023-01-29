/* eslint-disable @typescript-eslint/no-misused-promises */
import { RequestHandler } from 'express'

import { logger } from '../util'
import * as redisService from '../services/redisService'

export const createPut: RequestHandler = async (req, res) => {
  const eventId = await redisService.generateUniqueEventId()
  await redisService.createEvent(eventId, req.body)
  res.status(201).send(eventId)
}

export const eventGet: RequestHandler = async (req, res) => {
  const eventData = await redisService.getEvent(req.params.eventId)
  if (eventData === null) {
    res.sendStatus(404)
  } else {
    res.send(eventData)
  }
}

export const eventParticipantPut: RequestHandler = async (req, res) => {
  logger.debug(`Received participant data for event [${req.params.eventId}]: ${JSON.stringify(req.body)}`)
  await redisService.updateEventParticipant(req.params.eventId, req.body.name, req.body.availableDates)
  res.sendStatus(201)
}

export const eventParticipantDelete: RequestHandler = async (req, res) => {
  logger.debug(`Deleting participant [${req.params.participantName}] from event [${req.params.eventId}]`)
  await redisService.deleteEventParticipant(req.params.eventId, req.params.participantName)
  res.sendStatus(201)
}
