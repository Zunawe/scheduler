import React, { FC } from 'react'
import { Calendar } from 'react-nice-dates'
import { isSameDay } from 'date-fns'
import { enUS } from 'date-fns/locale'

interface MultiDatePickerProps {
  pickableDates?: Date[]
  selectedDates: Date[]
  onDayClick?: (date: Date) => void
}

export const MultiDatePicker: FC<MultiDatePickerProps> = ({ pickableDates, selectedDates, onDayClick }) => {
  const modifiers = {
    selected: (date: Date) => selectedDates.some((selectedDate) => isSameDay(selectedDate, date)),
    disabled: (date: Date) => pickableDates === undefined ? false : pickableDates.every((pickableDate) => !isSameDay(pickableDate, date))
  }

  const handleDayClick: (date: Date | null) => void = (date) => {
    if (date !== null) {
      onDayClick?.(date)
    }
  }

  return (
    <Calendar
      onDayClick={handleDayClick}
      modifiers={modifiers}
      locale={enUS}
      minimumDate={pickableDates === undefined ? undefined : pickableDates.reduce((earliest, date) => earliest < date ? earliest : date, pickableDates[0])}
      // touchDragEnabled is missing in the type declarations
      // https://github.com/hernansartorio/react-nice-dates/pull/70
      // @ts-expect-error
      touchDragEnabled={false}
    />
  )
}
