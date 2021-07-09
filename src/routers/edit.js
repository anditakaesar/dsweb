import { Router } from 'express'
import { ROLES } from '../helper/constants/roles'

const editRouter = Router()

editRouter.use((req, res, next) => {
  if (req.session.user.role === ROLES.STAFF) {
    next()
  } else {
    res.data.message = 'Unauthorized'
    res.render('error', {
      data: {
        ...res.data,
        user: req.session.user,
      }
    })
  }
})

editRouter.get('/', (req, res) => {
  res.render('edit', {
    data: {
      ...res.data,
      user: req.session.user,
    }
  })
})

export default editRouter