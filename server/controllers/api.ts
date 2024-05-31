/* eslint-disable @typescript-eslint/no-misused-promises */
import { RequestHandler } from 'express'

import { logger } from '../util'
import * as redisService from '../services/redisService'

export const createPut: RequestHandler = async (req, res) => {
  if (!Array.isArray(req.body) || !req.body.every((entry) => typeof entry === 'number')) {
    res.sendStatus(400)
    return
  }

  let eventId
  try {
    eventId = await redisService.generateUniqueEventId()
    await redisService.createEvent(eventId, req.body)
  } catch (error: any) {
    res.sendStatus(500)
    return
  }

  res.status(201).send(eventId)
}

export const eventGet: RequestHandler = async (req, res) => {
  let eventData
  try {
    eventData = await redisService.getEvent(req.params.eventId)
  } catch (error: any) {
    res.sendStatus(500)
    return
  }

  if (eventData === null) {
    res.sendStatus(404)
  } else {
    res.send(eventData)
  }
}

export const eventParticipantPut: RequestHandler = async (req, res) => {
  logger.debug(`Received participant data for event [${req.params.eventId}]: ${JSON.stringify(req.body)}`)

  try {
    await redisService.updateEventParticipant(req.params.eventId, req.body.name, req.body.availableDates)
  } catch (error: any) {
    res.sendStatus(500)
    return
  }

  res.sendStatus(201)
}

export const eventParticipantDelete: RequestHandler = async (req, res) => {
  logger.debug(`Deleting participant [${req.params.participantName}] from event [${req.params.eventId}]`)

  try {
    await redisService.deleteEventParticipant(req.params.eventId, req.params.participantName)
  } catch (error: any) {
    res.sendStatus(500)
    return
  }

  res.sendStatus(201)
}
