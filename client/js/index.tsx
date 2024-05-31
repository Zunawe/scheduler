/* eslint-disable import/first */
// Webpack hot module replacement
module.hot?.accept()

import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom'

import { App } from './App'
import { ContextProvider } from './context'
import { Helmet } from 'react-helmet'

ReactDOM.render(
  <StrictMode>
    <ContextProvider>
      <Helmet>
        <title>Scheduler</title>
      </Helmet>
      <App />
    </ContextProvider>
  </StrictMode>,
  document.getElementById('root')
)
