import { Router } from 'express'
import { ROLES } from '../helper/constants/roles'

const adminRouter = Router()

adminRouter.use((req, res, next) => {
  if (req.session.user.role === ROLES.ADMIN) {
    next()
  } else {
    res.redirect('/edit')
  }
})

adminRouter.get('/', (req, res) => {
  res.render('admin', {
    data: {
      ...res.data,
      user: req.session.user,
    }
  })
})

adminRouter.get('/user', (req, res) => {
  res.render('adminuser', {
    data: {
      ...res.data,
      user: req.session.user,
    }
  })
})

adminRouter.get('/config', (req, res) => {
  res.render('adminconfig', {
    data: {
      ...res.data,
      user: req.session.user,
    }
  })
})

export default adminRouter