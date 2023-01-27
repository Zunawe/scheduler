import React, { FC } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { Root, Event } from './routes'
import config from '../../config/config.json'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />
  },
  {
    path: '/event/:eventId',
    element: <Event />
  }
], {
  basename: config.basePath
})

export const App: FC = () => {
  return (
    <RouterProvider router={router} />
  )
}
