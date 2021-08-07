import session from 'express-session'
import Umzug from 'umzug'
import Sequelize from 'sequelize'
import genError from './errorHelper'
import logger from '../logger'

const db = require('../../models')
const SequelizeStore = require('connect-session-sequelize')(session.Store)
export const sessionStorage = new SequelizeStore({
  db: db.sequelize,
})

const { sequelize } = db
const umzug = new Umzug({
  storage: 'sequelize',
  storageOptions: {
    sequelize,
  },

  migrations: {
    params: [
      sequelize.getQueryInterface(),
      Sequelize,
    ],
    path: './migrations'
  },
})

export const migrateDatabase = () => {
  let migrations = []
  umzug.up()
    .then((mgs) => {
      mgs.forEach((v, i) => {
        migrations.push(v.file)
      })
      if (migrations.length > 0) {
        logger.info('migration complete', {
          migrations,
        })
      }
      return migrations
    })
    .catch((err) => {
      logger.error(err.message, genError(err, null))
      return migrations
    })
}

export default db