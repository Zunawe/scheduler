import React, { useContext, FC, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import moment from 'moment'

import { Button } from '.'
import { AppContext } from '../context/app'
import { pullEventData } from '../context/actions/app'
import axios from 'axios'

export const Summary: FC = () => {
  const [state, dispatch] = useContext(AppContext)
  const { eventId } = useParams()

  useEffect(() => {
    if (eventId !== undefined) {
      dispatch(pullEventData(eventId))
    }
  }, [])

  const handleClickDelete: (name: string) => void = (name) => {
    if (eventId !== undefined) {
      axios.delete(`/scheduler/api/event/${eventId}/participant/${name}`)
        .then(() => {
          dispatch(pullEventData(eventId))
        })
        .catch((error) => console.log(error))
    }
  }

  const availableIntersection: number[] = state.eventData.options
    .filter((option) => Object.values(state.eventData.participants).every((availableDates) => availableDates.some((date) => moment(option).isSame(moment(date)), 'day')))

  const availabilityData = state.eventData.options.map((date) => ({
    date,
    dateString: moment(new Date(date)).format('MMMM Do'),
    participants: Object.entries(state.eventData.participants)
      .filter(([name, availableDates]) => availableDates.some((participantDate) => moment(participantDate).isSame(moment(date), 'day')))
      .map(([name]) => name)
  }))

  availabilityData.sort((a, b) => a.date - b.date)
  availabilityData.sort((a, b) => (b.participants.length - a.participants.length) + (0.1 * Math.sign(a.date - b.date)))
  availabilityData.forEach(({ participants }) => {
    participants.sort((a, b) => a.charCodeAt(0) - b.charCodeAt(0))
  })

  return (
    <div>
      <h5>Dates where everyone is available</h5>
      <ul>
        {
          availableIntersection.length === 0
            ? (<p>There are no dates where everyone is available</p>)
            : availableIntersection
              .map((date) => moment(new Date(date)).format('MMMM Do'))
              .map((dateString) => (<li key={dateString}>{dateString}</li>))
        }
      </ul>
      <hr />
      <h5>Availability</h5>
      <ul>
        {
          availabilityData.map(({ dateString, participants }) => {
            return (
              <li key={dateString}>
                [{participants.length}] {dateString}
                <ul>
                  {
                    participants.map((name) => (<li key={name}>{name}</li>))
                  }
                </ul>
              </li>
            )
          })
        }
      </ul>
      <hr />
      <h5>Participants</h5>
      {Object.entries(state.eventData.participants).map(([name, availableDates], i) => (
        <div key={name}>
          <div className='card text-bg-dark mb-3'>
            <div className='card-header'>
              <span className='align-middle'>{name}</span>
              <span className='float-end'><Button type='danger' size='sm' onClick={() => handleClickDelete(name)}>Delete</Button></span>
            </div>
            <div className='card-body'>
              <ul>{availableDates.map((date) => moment(new Date(date)).format('MMMM Do')).map((dateString) => (<li key={dateString}>{dateString}</li>))}</ul>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
