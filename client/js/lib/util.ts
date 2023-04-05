import moment from 'moment'

export const localDateToUtc = (t: number): number => {
  const m = moment(t)
  return m.add(m.utcOffset(), 'minutes').valueOf()
}

export const utcDateToLocal = (t: number): number => {
  const m = moment(t)
  return m.subtract(m.utcOffset(), 'minutes').valueOf()
}
