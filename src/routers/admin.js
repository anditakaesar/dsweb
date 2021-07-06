import { Router } from 'express'
import { ROLES } from '../helper/constants/roles'

const adminRouter = Router()

adminRouter.get('/', (req, res) => {
  if (req.session.user.role === ROLES.ADMIN) {
    res.render('admin', {
      data: {
        ...res.data,
        user: req.session.user,
      }
    })
  } else {
    res.redirect('/edit')
  }
})

export default adminRouter