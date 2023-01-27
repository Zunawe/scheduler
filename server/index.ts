/* eslint-disable @typescript-eslint/no-misused-promises */
import path from 'path'
import express from 'express'
import helmet from 'helmet'

import { httpLogger, errorLogger } from './middleware'
import { logger } from './util'
import * as routes from './routes'
import config from '../config/config.json'

const init = async (): Promise<void> => {
  const NODE_ENV = process.env.NODE_ENV
  const PORT = process.env.PORT ?? '8000'

  if (NODE_ENV === undefined) {
    throw new Error('NODE_ENV was not specified, please explicitly set NODE_ENV')
  }

  const app = express()

  // Middlewares
  if (process.env.NODE_ENV === 'production') {
    app.use(helmet())
  }

  app.use(httpLogger)

  // Hot module replacement
  if (process.env.NODE_ENV === 'development') {
    try {
      const webpack = (await import('webpack')).default
      const webpackConfig = (await import(path.join(process.cwd(), 'webpack.dev'))).default

      const compiler = webpack(webpackConfig)

      const webpackDevMiddleware = (await import('webpack-dev-middleware')).default
      app.use(webpackDevMiddleware(compiler, {
        publicPath: webpackConfig.output.publicPath,
        stats: 'errors-only',
        writeToDisk: true
      }))

      const webpackHotMiddleware = (await import('webpack-hot-middleware')).default
      app.use(webpackHotMiddleware(compiler, {
        log: false,
        path: '/__webpack_hmr'
      }))
    } catch (error: any) {
      logger.error('Couldn\'t load webpack hot module replacement. Did you mean to run in production mode?')
    }
  }

  app.use(express.json())

  // Routes
  const router = express.Router()
  router.use('/static', express.static(path.join(process.cwd(), 'dist', 'client')))
  router.use('/api', routes.api)
  router.use('/', routes.root)

  app.use(config.basePath, router)

  app.use(errorLogger)

  // Starting the server
  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`)
  })
}

init()
  .then(() => { })
  .catch((error) => { throw error })
