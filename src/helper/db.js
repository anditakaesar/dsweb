import session from 'express-session'

const db = require('../../models')
const SequelizeStore = require('connect-session-sequelize')(session.Store)
export const sessionStorage = new SequelizeStore({
  db: db.sequelize,
})

export default db