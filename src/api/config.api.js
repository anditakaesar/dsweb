import { Router } from 'express'
import db from '../helper/db'
import helper from '../helper'
import genError from '../helper/errorHelper'

const configRouter = Router()
const { Config } = db

function FormatConfig(cfg) {
  let newConfig = {}
  newConfig.id = cfg.id
  newConfig.configkey = cfg.configkey
  newConfig.configvalue = cfg.configvalue
  return newConfig
}

configRouter.post('/', (req, res) => {
  process.nextTick(() => {
    Config.create({
      configkey: req.body.configkey,
      configvalue: req.body.configvalue,
    })
      .then((cfg) => {
        res.json({
          message: 'save success',
          messageType: 'primary',
          data: cfg,
        })
      })
      .catch((err) => {
        err = genError(err, req)
        helper.logger.error(err.message, err)
        res.json({
          message: `error: ${err.message}`,
          messageType: 'danger'
        })
      })
  })
})

configRouter.post('/:id', (req, res, next) => {
  if (req.params.id == undefined) {
    let error = genError(null, req)
    error.message('params.id required')
    next(error)
  } else {
    next()
  }
}, (req, res) => {
  process.nextTick(() => {
    Config.findOne({
      where: { id: req.params.id },
    })
      .then((cfg) => {
        if (!cfg) {
          throw new Error(`no result for id ${req.params.id}`)
        }
        cfg.update({
          configkey: req.body.configkey,
          configvalue: req.body.configvalue,
        })
        res.json({
          message: 'update success',
          messageType: 'success',
          data: cfg,
        })
      })
      .catch((err) => {
        err = genError(err, req)
        helper.logger.error(err.message, err)
        res.json({
          message: `error: ${err.message}`,
          messageType: 'danger'
        })
      })
  })
})

configRouter.get('/all', (req, res) => {
  process.nextTick(() => {
    Config.findAndCountAll()
      .then((results) => {
        let data = []
        results.rows.forEach((cfg, i) => {
          data.push(FormatConfig(cfg))
        })
        res.json({
          message: 'all config loaded',
          messageType: 'primary',
          data,
          count: results.count,
        })
      })
      .catch((err) => {
        err = genError(err, req)
        helper.logger.error(err.message, err)
        res.json({
          message: `error: ${err.message}`,
          messageType: 'danger'
        })
      })
  })
})

configRouter.get('/:id', (req, res, next) => {
  if (req.params.id == undefined) {
    let error = genError(null, req)
    error.message('params.id required')
    next(error)
  } else {
    next()
  }
}, (req, res) => {
  process.nextTick(() => {
    Config.findOne({
      where: { id: req.params.id },
    })
      .then((result) => {
        if (!result) {
          throw new Error(`no result for id ${req.params.id}`)
        }
        res.json({
          message: 'config loaded',
          config: FormatConfig(result),
        })
      })
      .catch((err) => {
        err = genError(err, req)
        helper.logger.error(err.message, err)
        res.json({
          message: 'error',
          errmsg: err.message,
        })
      })
  })
})

configRouter.delete('/:id', (req, res, next) => {
  if (req.params.id == undefined) {
    let error = genError(null, req)
    error.message('params.id required')
    next(error)
  } else {
    next()
  }
}, (req, res) => {
  process.nextTick(() => {
    Config.destroy({
      where: { id: req.params.id },
    })
      .then((result) => {
        if (!result) {
          throw new Error(`no result for id ${req.params.id}`)
        }
        res.json({
          message: 'config deleted',
          messageType: 'danger',
          config: FormatConfig(result),
        })
      })
      .catch((err) => {
        err = genError(err, req)
        helper.logger.error(err.message, err)
        res.json({
          message: 'error',
          errmsg: err.message,
        })
      })
  })
})

export default configRouter