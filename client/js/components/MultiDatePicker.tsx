import React, { FC, useEffect, useState } from 'react'
import { Calendar } from 'react-nice-dates'
import enUS from 'date-fns/locale/en-US'
import moment from 'moment'

interface MultiDatePickerProps {
  pickableDates?: Date[]
  selectedDates: Date[]
  onDayClick?: (date: Date) => void
}

export const MultiDatePicker: FC<MultiDatePickerProps> = ({ pickableDates, selectedDates, onDayClick }) => {
  const [month, setMonth] = useState<Date>(new Date())
  const [didGetPickableDates, setDidGetPickableDates] = useState<boolean>(false)

  useEffect(() => {
    if (pickableDates !== undefined && pickableDates.length > 0) {
      setDidGetPickableDates(true)
    }
  }, [pickableDates])

  useEffect(() => {
    if (!didGetPickableDates) {
      setMonth(pickableDates === undefined || pickableDates.length === 0 ? new Date() : pickableDates.reduce((earliest, date) => earliest < date ? earliest : date, pickableDates[0]))
    }
  }, [didGetPickableDates, pickableDates])

  const modifiers = {
    selected: (date: Date) => selectedDates.some((selectedDate) => moment(selectedDate).isSame(moment(date), 'day')),
    disabled: (date: Date) => pickableDates === undefined ? false : pickableDates.every((pickableDate) => !moment(pickableDate).isSame(moment(date), 'day'))
  }

  const handleDayClick: (date: Date | null) => void = (date) => {
    if (date !== null) {
      onDayClick?.(date)
    }
  }

  return (
    <div className='calendar-container'>
      <Calendar
        onDayClick={handleDayClick}
        modifiers={modifiers}
        locale={enUS}
        month={month}
        onMonthChange={(newMonth) => { if (newMonth !== null) setMonth(newMonth) }}
        // touchDragEnabled is missing in the type declarations
        // https://github.com/hernansartorio/react-nice-dates/pull/70
        // @ts-expect-error
        touchDragEnabled={false}
      />
    </div>
  )
}
