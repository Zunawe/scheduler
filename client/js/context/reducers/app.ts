import { SetEventDataAction } from '../actions/app'
import { utcDateToLocal } from '../../lib'

export const reducer: Reducer = (state, action) => {
  if (action instanceof SetEventDataAction) {
    return {
      ...state,
      eventData: {
        options: action.payload.options.map(utcDateToLocal),
        participants: Object.entries<number[]>(action.payload.participants).reduce((acc, [participant, dates]) => {
          return {
            ...acc,
            [participant]: dates.map(utcDateToLocal)
          }
        }, {})
      }
    }
  }
  return state
}
