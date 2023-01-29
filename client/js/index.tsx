/* eslint-disable import/first */
// Webpack hot module replacement
module.hot?.accept()

import React from 'react'
import ReactDOM from 'react-dom'

import { App } from './App'
import { ContextProvider } from './context'
import { Helmet } from 'react-helmet'

ReactDOM.render(
  <ContextProvider>
    <Helmet>
      <title>Scheduler</title>
    </Helmet>
    <App />
  </ContextProvider>,
  document.getElementById('root')
)
