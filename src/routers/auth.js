import { Router } from 'express'
import logger from '../logger'
import db from '../helper/db'
import { ALERT } from '../helper/css/alert'
import { validatePassword } from '../helper/sessionHelper'
import genError from '../helper/errorHelper'

const { User } = db

const messages = {
  LOGIN: 'Please login',
  WRONGUSERPASS: 'User not found or wrong password',
  FILL: 'Please fill the username and password',
  LOGOUT: 'You have been logged out',
}

const routerAuth = Router()

const fieldCheck = (req, res, next) => {
  if (!req.body.username || !req.body.password) {
    res.data.message_type = ALERT.WARNING
    res.render('login', {
      data: {
        ...res.data,
        message: messages.FILL
      }
    })
  } else {
    next()
  }
}

export const loginRoute = (req, res, next) => {
  if (req.session.user === undefined) {
    res.data.message_type = ALERT.WARNING
    res.render('login', {
      data: {
        ...res.data,
        message: messages.LOGIN
      }
    })
  } else {
    res.redirect('/admin')
  }
}

routerAuth.get('/login', loginRoute)

routerAuth.post('/login', fieldCheck, (req, res, next) => {
  process.nextTick(() => {
    User.findOne({
      where: { username: req.body.username },
    })
      .then((user) => {
        if (user) {
          if (validatePassword(req.body.password, user.password)) {
            req.session.user = {
              authenticated: true,
              id: user.id,
              username: user.username,
              role: user.role
            }
            req.session.user[user.role] = true
            res.redirect('/admin')
          } else {
            res.data.message_type = ALERT.DANGER
            res.render('login', {
              data: {
                ...res.data,
                message: messages.WRONGUSERPASS
              }
            })
          }
        } else {
          res.data.message_type = ALERT.DANGER
          res.render('login', {
            data: {
              ...res.data,
              message: messages.WRONGUSERPASS
            }
          })
        }
      })
      .catch((err) => {
        next(genError(err, req))
      })
  })
})

routerAuth.get('/logout', (req, res) => {
  req.session.destroy()
  res.render('logout', {
    data: {
      ...res.data,
      message: messages.LOGOUT,
    },
  })
})

export default routerAuth