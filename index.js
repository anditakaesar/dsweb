require('dotenv').config()
const app = require('./dist/app').default
const env = require('./dist/env').default
const logger = require('./dist/logger').default

app.listen(env.PORT, () => {
  if (env.NODE_ENV.includes('dev')) {
    logger.info('env', env)
  }
  logger.info('App done initializing...', { env: env.NODE_ENV })
  console.log('app running at http://localhost:8000')
  console.log('CLOSE THIS WINDOW WHEN DONE')
})