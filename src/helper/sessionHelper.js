import bcrypt from 'bcrypt'

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
    res.data.error = {
      message: 'You must login',
      meta: {
        intmsg: 'accessing checkSessionApi',
      },
    }
    next(res.data.error)
  } else {
    next()
  }
}

export const validatePassword = (pass, hash) => {
  return bcrypt.compareSync(pass, hash)
}