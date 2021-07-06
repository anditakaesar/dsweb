import exphbs from 'express-handlebars'
import path from 'path'
import env from './env'

const hbs = exphbs.create({
  extname: 'hbs',
  defaultLayout: 'default',
  layoutsDir: path.join(__dirname, '../views/layouts'),
  partialsDir: path.join(__dirname, '../views/partials'),
})

const sessionCookieConfig = {
  maxAge: env.SESSION_AGESEC * 1000,
  secure: false,
  httpOnly: true,
  sameSite: true,
}

const configs = {
  hbs, sessionCookieConfig
}

export default configs