import React, { useContext, FC, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import moment from 'moment'
import { isSameDay } from 'date-fns'

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

  return (
    <div>
      <h5>Dates where everyone is available</h5>
      <ul>
        {
          state.eventData.options
            .filter((option) => state.eventData.participants.every((participant) => participant.availableDates.some((date) => isSameDay(option, date))))
            .map((date) => moment(new Date(date)).format('MMMM Do'))
            .map((dateString) => (<li key={dateString}>{dateString}</li>))
        }
      </ul>
      <hr />
      <h5>Participants</h5>
      {state.eventData.participants.map(({ name, availableDates }, i) => (
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
