import { Router } from 'express'
import db from '../helper/db'
import helper from '../helper'
import { ROLES } from '../helper/constants/roles'
import bcrypt from 'bcrypt'

const userRouter = Router()
const { User } = db

function FormatUser(user) {
  let newUser = {}
  newUser.id = user.id
  newUser.role = user.role
  newUser.username = user.username
  return newUser
}

userRouter.get('/all', (req, res) => {
  process.nextTick(() => {
    User.findAndCountAll({
      where: { role: ROLES.STAFF },
    })
    .then((results) => {
      let data = []
      results.rows.forEach((user, i) => {
        data.push(FormatUser(user))
      })
      res.json({
        message: 'all users loaded',
        data,
        count: results.count,
      })
    })
    .catch((err) => {
      res.json({
        message: 'error',
        errmsg: err.message,
      })
    })
  })
})

userRouter.get('/:id', (req, res) => {
  process.nextTick(() => {
    User.findOne({
      where: { id: req.params.id },
    })
    .then((result) => {
      res.json({
        message: 'user loaded',
        user: FormatUser(result),
      })
    })
    .catch((err) => {
      res.json({
        message: 'error',
        errmsg: err.message,
      })
    })
  })
})

userRouter.post('/:id', (req, res) => {
  process.nextTick(() => {
    User.findOne({
      where: { id: req.params.id },
    })
    .then((user) => {
      // update
      if (req.body.password != req.body.passwordConfirm) {
        throw new Error('Password and Confirm Password must be same!');
      }
      if (user) {
        let hasPass = bcrypt.hashSync(req.body.password, helper.env.SALT_HASH)
        user.update({
          username: req.body.username,
          password: hasPass,
        })
      }
      res.json({
        message: 'POST INVOKED',
        user,
        request: req.body
      })
    })
    .catch((err) => {
      res.json({
        message: 'error',
        errmsg: err.message,
      })
    })
  })
})

export default userRouter