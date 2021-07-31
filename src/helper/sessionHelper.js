import bcrypt from 'bcrypt'
import genError from './errorHelper'

export const checkSession = (req, res, next) => {
  if (req.session.user === undefined) {
    res.message = 'You must login'
    res.redirect('/auth/login')
  } else {
    next()
  }
}

export const checkSessionApi = (req, res, next) => {
  if (req.session.user === undefined) {
    let error = genError(null, req)
    error.message = 'You Must Login'
    next(error)
  } else {
    next()
  }
}

export const validatePassword = (pass, hash) => {
  return bcrypt.compareSync(pass, hash)
}