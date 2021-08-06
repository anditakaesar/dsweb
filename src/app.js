import express from 'express'
import { json, urlencoded } from 'body-parser'
import compression from 'compression'
import path from 'path'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import helper from './helper'
import { checkSession, checkSessionApi } from './helper/sessionHelper'
import { ALERT } from './helper/css/alert'
import { loginRoute } from './routers/auth'
import genError from './helper/errorHelper'

const { routers, env, sessionStorage, funct } = helper
const { hbs, sessionCookieConfig } = helper.configs

const app = express()

// middlewares
app.use(json())
app.use(urlencoded({ extended: true }))
app.use(compression())
app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
)

//session
sessionStorage.sync()
app.use(session({
  name: env.SESSION_NAME,
  secret: env.COOKIES_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: sessionCookieConfig,
  store: sessionStorage,
}))
app.use(cookieParser(env.COOKIES_SECRET))

// migration
funct.migrateDatabase()

// static files
app.use(express.static(path.join(__dirname, '../static')))

//view engine
app.set('views', path.join(__dirname, '../views'))
app.set('view engine', 'hbs')
app.engine('hbs', hbs.engine)

// global routers
app.use((req, res, next) => {
  res.data = {}
  res.data.title = 'DS Web'
  res.data.message_type = ALERT.PRIMARY
  next()
})

app.use('/api', checkSessionApi, routers.api)
app.use('/admin', checkSession, routers.routerAdmin)
app.use('/edit', checkSession, routers.editRouter)
app.use('/auth', routers.routerAuth)
app.use('/migration', routers.migrationRouter)

app.get('/', loginRoute)

// error handling
app.use((err, req, res, next) => {
  err = genError(err, req)
  helper.logger.error(err.message, err)
  
  res.status(500).json({
    message: 'Some error, please contact your developer',
    error
  })
})

export default app