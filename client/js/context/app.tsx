import React, { FC, ReactNode, createContext } from 'react'

import { useEnhancedReducer } from '../hooks'
import { thunkMiddleware } from './middlewares'
import { reducer } from './reducers/app'
import { type Dispatch } from './types'

export interface State {
  eventData: {
    options: number[]
    participants: {
      [name: string]: number[]
    }
  }
}

const initialState: State = {
  eventData: {
    options: [],
    participants: {}
  }
}

interface AppContextProviderProps {
  children: ReactNode
}

export const AppContext = createContext<[State, Dispatch, () => State]>([initialState, () => {}, () => initialState])

export const AppContextProvider: FC<AppContextProviderProps> = ({ children }) => {
  const store = useEnhancedReducer(reducer, initialState, undefined, [thunkMiddleware])

  return (
    <AppContext.Provider value={[store.state, store.dispatch, store.getState]}>
      {children}
    </AppContext.Provider>
  )
}
