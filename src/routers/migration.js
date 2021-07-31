import { Router } from 'express'
import Umzug from 'umzug'
import Sequelize from 'sequelize'
import db from '../helper/db'
import logger from '../logger'
import env from '../env'
import genError from '../helper/errorHelper'

const router = Router()
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

router.get('/', (req, res, next) => {
  if (req.query.key !== env.MIGRATION_KEY) {
    logger.info('migration attempt', { key: req.query.key })
    res.sendStatus(404)
  } else {
    next()
  }
}, (req, res, next) => {
  process.nextTick(() => {
    let migrations = []
    umzug.up()
      .then((mgs) => {
        mgs.forEach((v, i) => {
          migrations.push(v.file)
        })
        logger.info('migration complete', {
          migrations,
        })
        res.json({
          message: 'migration completed',
          migrations,
        })
      })
      .catch((err) => {
        logger.error(err.message, genError(err, req))
        next(err)
      })
  })
})

export default router