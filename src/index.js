import app from './app'
import helper from './helper'
import path from 'path'

const { logger, env } = helper

app.listen(env.PORT, () => {
  if (env.NODE_ENV.includes('dev')) {
    logger.info(`app running at port: ${env.PORT}`)
    logger.info('env vars', env)
  }
})