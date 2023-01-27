import { SetEventDataAction } from '../actions/app'

export const reducer: Reducer = (state, action) => {
  if (action instanceof SetEventDataAction) {
    return {
      ...state,
      eventData: action.payload
    }
  }
  return state
}
