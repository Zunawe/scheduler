import React, { FC, useContext, useState } from 'react'
import { useParams } from 'react-router-dom'
import { isSameDay } from 'date-fns'
import axios from 'axios'

import { pullEventData } from '../context/actions/app'
import { Button, Text, TextInput, Summary, MultiDatePicker } from '../components'
import { AppContext } from '../context/app'

export const Event: FC = () => {
  const [state, dispatch] = useContext(AppContext)
  const pickable = state.eventData.options.map((n) => new Date(n))
  const [participant, setParticipant] = useState<string>('')
  const [selectedDates, setSelectedDates] = useState<(Date)[]>(pickable)
  const [submitClicked, setSubmitClicked] = useState<boolean>(false)

  const { eventId } = useParams()

  const handleDayClick: (date: Date) => void = (date) => {
    const dateIndex = selectedDates.findIndex((selectedDate) => isSameDay(selectedDate, date))
    if (dateIndex === -1) {
      setSelectedDates([...selectedDates, date])
    } else {
      setSelectedDates([...selectedDates.slice(0, dateIndex), ...selectedDates.slice(dateIndex + 1, undefined)])
    }
  }

  const handleSubmitClick: () => void = () => {
    setSubmitClicked(true)
    if (participant === '') {
      return
    }

    if (eventId !== undefined) {
      axios.put(`/scheduler/api/event/${eventId}/participant`, {
        name: participant,
        availableDates: selectedDates.map((d) => d.valueOf())
      }).then(() => {
        dispatch(pullEventData(eventId))
      }).catch((error) => console.log(error))
    }
  }

  return (
    <main className='container-fluid mt-2' style={{ maxWidth: '600px' }}>
      <Text>Enter your name and select all dates you are available. Make sure to check the next month or two. If you need to edit your response, just resubmit and make sure the names match.</Text>
      <TextInput invalid={submitClicked && participant === ''} value={participant} placeholder='Name' onChange={setParticipant} />
      {submitClicked && participant === '' ? <div className='invalid-feedback'>Please add your name.</div> : null}
      <MultiDatePicker pickableDates={pickable} selectedDates={selectedDates} onDayClick={handleDayClick} />
      <div className='d-grid'>
        <Button onClick={handleSubmitClick}>Submit</Button>
      </div>
      <hr />
      <Summary />
    </main>
  )
}
