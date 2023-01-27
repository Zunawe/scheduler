import axios from 'axios'

import { Action } from './Action'
import { Thunk } from '../middlewares'

export class SetEventDataAction extends Action {}
export const setEventData = (data: any): SetEventDataAction => (new SetEventDataAction(data))

export const pullEventData: (eventId: string) => Thunk = (eventId) => {
  return (dispatch, getState) => {
    axios
      .get(`/scheduler/api/event/${eventId}`).then((response) => {
        dispatch(setEventData(response.data))
      })
      .catch(() => window.location.replace('/scheduler'))
  }
}
