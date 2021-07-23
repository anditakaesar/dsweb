import { Router } from 'express'
import helper from '../helper'
import bcrypt from 'bcrypt'
import userRouter from './user'
import configRouter from './config.api'
import entryRouter from './entry.api'

const api = Router()

api.use('/user', userRouter)
api.use('/config', configRouter)
api.use('/entry', entryRouter)

api.get('/', (req, res) => {
  res.status(200).json({
    message: 'api connect'
  })
})

api.get('/log', (req, res) => {
  helper.logger.info('invoked logging')
  res.status(200).json({
    message: 'invoking log',
    value: Math.random()
  })
})

api.get('/passgen', (req, res) => {
  if (req.query.s !== undefined) {
    bcrypt.hash(req.query.s, helper.env.SALT_HASH)
    .then((hash) => {
      res.json({
        message: 'done',
        hash: hash
      })
    })
    .catch((err) => {
      res.json({
        message: 'error',
        err: err.message
      })
    })
  } else {
    res.json({
      message: 'param required'
    })
  }
})

export default api