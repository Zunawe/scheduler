import Redis from 'ioredis'

import { logger } from '../util'

declare interface CalendarEvent {
  dateCreated: number
  options: number[]
  participants: {
    [name: string]: number[]
  }
}

const getClient: () => Redis | null = (() => {
  let client: Redis | null = null

  const REDIS_HOST = process.env.REDIS_HOST
  if (REDIS_HOST === undefined) {
    throw new Error('REDIS_HOST was not specified, can\'t connect to redis')
  }

  if (process.env.REDIS_PORT === undefined) {
    throw new Error('REDIS_PORT was not specified, can\'t connect to redis')
  }
  const REDIS_PORT = Number.parseInt(process.env.REDIS_PORT)

  return () => {
    if (client === null) {
      try {
        client = new Redis(REDIS_PORT, REDIS_HOST)
      } catch (err) {
        logger.error('Could not connect to redis')
        logger.error((err as Error).stack)
      }
    }

    return client
  }
})()

export const connect: () => Promise<void> = async () => {
  void getClient()
}

export const disconnect: () => Promise<void> = async () => {
  await getClient()?.quit()
  logger.info('Disconnected from redis')
}

export const createEvent: (eventId: string, options: number[]) => Promise<void> = async (eventId, options) => {
  const redis = getClient()
  if (redis === null) {
    throw new Error('Cannot create event, not connected to redis')
  }

  const event: CalendarEvent = { dateCreated: Date.now().valueOf(), options, participants: {} }
  await redis.call('JSON.SET', eventId, '$', JSON.stringify(event))

  logger.debug(`Created new event [${eventId}]: ${JSON.stringify(event)}`)
}

export const getEvent: (eventId: string) => Promise<CalendarEvent | null> = async (eventId) => {
  const redis = getClient()
  if (redis === null) {
    throw new Error('Cannot get event, not connected to redis')
  }

  const results: any[] | null = JSON.parse((await redis.call('JSON.GET', eventId, '$')) as string)

  logger.debug(`Retrieved event from redis: ${JSON.stringify(results)}`)

  return results === null ? null : results[0]
}

export const updateEventParticipant: (eventId: string, participantName: string, availableDates: number[]) => Promise<void> = async (eventId, participantName, availableDates) => {
  const redis = getClient()
  if (redis === null) {
    throw new Error('Cannot update event, not connected to redis')
  }

  await redis.call('JSON.SET', eventId, `$.participants["${participantName}"]`, JSON.stringify(availableDates))
}

export const deleteEventParticipant: (eventId: string, participantName: string) => Promise<void> = async (eventId, participantName) => {
  const redis = getClient()
  if (redis === null) {
    throw new Error('Cannot update event, not connected to redis')
  }

  await redis.call('JSON.DEL', eventId, `$.participants["${participantName}"]`)
}

const ALPHABET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

export const generateUniqueEventId: () => Promise<string> = async () => {
  const redis = getClient()
  if (redis === null) {
    throw new Error('Cannot generate a unique event id, not connected to redis')
  }

  let eventId
  do {
    eventId = (new Array(5))
      .fill(null)
      .map(() => Math.floor(Math.random() * ALPHABET.length))
      .map((i) => ALPHABET.charAt(i))
      .join('')
  } while ((await redis.exists(eventId)) > 0)

  return eventId
}
