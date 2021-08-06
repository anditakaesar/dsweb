import { Router } from 'express'
import Umzug from 'umzug'
import Sequelize from 'sequelize'
import db from '../helper/db'
import { migrateDatabase } from '../helper/db'
import logger from '../logger'
import env from '../env'

const router = Router()

router.get('/', (req, res, next) => {
  if (req.query.key !== env.MIGRATION_KEY) {
    logger.info('migration attempt', { key: req.query.key })
    res.sendStatus(404)
  } else {
    next()
  }
}, (req, res, next) => {
  process.nextTick(() => {
    let migrations = migrateDatabase()
    res.json({
      message: 'migration completed',
      migrations,
    })
  })
})

export default router