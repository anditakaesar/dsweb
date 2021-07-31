require('dotenv').config()
const app = require('./dist/app').default
const env = require('./dist/env').default

app.listen(env.PORT, () => {
  console.log(env)
  console.log('app running at http://localhost:8000')
  console.log('CLOSE THIS WINDOW WHEN DONE')
})