import path from 'path'
import fsPromises from 'fs/promises'

import { logger } from '../util'

const filepath = process.env.DB_FILE_PATH ?? path.join(process.cwd(), 'db.json')

declare interface Data {
  [eventId: string]: CalendarEvent
}

declare interface CalendarEvent {
  dateCreated: number
  options: number[]
  participants: ParticipantData[]
}

declare interface ParticipantData {
  name: string
  availableDates: number[]
}

export const createEvent: (eventId: string, options: number[]) => Promise<void> = async (eventId, options) => {
  try {
    let data: Data = JSON.parse((await fsPromises.readFile(filepath, 'utf-8')) ?? '{}')

    data[eventId] = { dateCreated: Date.now().valueOf(), options, participants: [] }

    const listForm = Object.entries(data)
    if (listForm.length > 10) {
      listForm.sort(([eventIdA, eventA], [eventIdB, eventB]) => eventB.dateCreated - eventA.dateCreated)
      data = listForm.slice(0, 10).reduce((acc, [eventId, event]) => ({ ...acc, [eventId]: event }), {})
    }

    await fsPromises.writeFile(filepath, JSON.stringify(data), 'utf-8')
  } catch (e) {
    logger.error('Failed to read or write from db file')
    console.log(e)
  }
}

export const getEvent: (eventId: string) => Promise<CalendarEvent | undefined> = async (eventId) => {
  try {
    const data: Data = JSON.parse((await fsPromises.readFile(filepath, 'utf-8')) ?? '{}')

    return data[eventId]
  } catch (e) {
    logger.error('Failed to read or write from db file')
    console.log(e)
  }
}

export const updateEventParticipant: (eventId: string, participant: ParticipantData) => Promise<void> = async (eventId, participant) => {
  try {
    const data: Data = JSON.parse((await fsPromises.readFile(filepath, 'utf-8')) ?? '{}')

    const event: CalendarEvent = data[eventId]
    const participentIndex = event.participants.findIndex((p) => p.name === participant.name)

    if (participentIndex === -1) {
      event.participants = [...event.participants, participant]
    } else {
      event.participants[participentIndex] = participant
    }

    await fsPromises.writeFile(filepath, JSON.stringify(data), 'utf-8')
  } catch (e) {
    logger.error('Failed to read or write from db file')
    console.log(e)
  }
}

export const deleteEventParticipant: (eventId: string, participantName: string) => Promise<void> = async (eventId, participantName) => {
  try {
    const data: Data = JSON.parse((await fsPromises.readFile(filepath, 'utf-8')) ?? '{}')

    const event: CalendarEvent = data[eventId]

    event.participants = event.participants.filter(({ name }) => name !== participantName)

    await fsPromises.writeFile(filepath, JSON.stringify(data), 'utf-8')
  } catch (e) {
    logger.error('Failed to read or write from db file')
    console.log(e)
  }
}
