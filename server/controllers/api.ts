/* eslint-disable @typescript-eslint/no-misused-promises */
import { RequestHandler } from 'express'

import { logger } from '../util'
import { createEvent, getEvent, updateEventParticipant, deleteEventParticipant } from '../services/dbService'

const ALPHABET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

export const createPut: RequestHandler = async (req, res) => {
  // Need to make sure this doesn't collide
  const eventId = (new Array(5))
    .fill(null)
    .map(() => Math.floor(Math.random() * ALPHABET.length))
    .map((i) => ALPHABET.charAt(i))
    .join('')
  logger.info(`Creating new event [${eventId}]`)
  await createEvent(eventId, req.body)
  res.status(201).send(eventId)
}

export const eventGet: RequestHandler = async (req, res) => {
  const eventData = await getEvent(req.params.eventId)
  if (eventData === undefined) {
    res.sendStatus(404)
  }
  res.send(eventData)
}

export const eventParticipantPut: RequestHandler = async (req, res) => {
  logger.info(`Received participant data for event [${req.params.eventId}]: ${JSON.stringify(req.body)}`)
  await updateEventParticipant(req.params.eventId, req.body)
  res.sendStatus(201)
}

export const eventParticipantDelete: RequestHandler = async (req, res) => {
  logger.info(`Deleting participant [${req.params.participantName}] from event [${req.params.eventId}]: ${JSON.stringify(req.body)}`)
  await deleteEventParticipant(req.params.eventId, req.params.participantName)
  res.sendStatus(201)
}
