import React, { useState, FC } from 'react'
import { useNavigate } from 'react-router-dom'
import { isSameDay } from 'date-fns'
import axios from 'axios'

import { Button, Text, MultiDatePicker } from '../components'

export const Root: FC = () => {
  const navigate = useNavigate()
  const [selectedDates, setSelectedDates] = useState<(Date)[]>([])

  const handleDayClick: (date: Date) => void = (date) => {
    const dateIndex = selectedDates.findIndex((selectedDate) => isSameDay(selectedDate, date))
    if (dateIndex === -1) {
      setSelectedDates([...selectedDates, date])
    } else {
      setSelectedDates([...selectedDates.slice(0, dateIndex), ...selectedDates.slice(dateIndex + 1, undefined)])
    }
  }

  const handleSubmitClick: () => void = () => {
    axios.put('/scheduler/api/create', selectedDates.map((date) => date.valueOf()))
      .then((response) => {
        if (response.status === 201) {
          navigate(`/scheduler/event/${(response.data as string)}`)
        }
      })
      .catch((error) => console.log(error))
  }

  return (
    <main className='container-fluid mt-2' style={{ maxWidth: '600px' }}>
      <Text>Select dates to poll and click <strong>Create New</strong>. Then when you're redirected to the event page, share that URL.</Text>
      <MultiDatePicker selectedDates={selectedDates} onDayClick={handleDayClick} />
      <div className='d-grid'>
        <Button onClick={handleSubmitClick}>Create New</Button>
      </div>
    </main>
  )
}
