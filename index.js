require('dotenv').config()
const app = require('./dist/app').default
const env = require('./dist/env').default
const logger = require('./dist/logger').default

app.listen(env.PORT, () => {
  logger.info('env', process.env.NODE_ENV)
  if (env.NODE_ENV.includes('dev')) {
    logger.info('env', env)
  }
  console.log('app running at http://localhost:8000')
  console.log('CLOSE THIS WINDOW WHEN DONE')
})