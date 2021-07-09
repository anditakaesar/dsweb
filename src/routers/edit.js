import { Router } from 'express'

const editRouter = Router()

editRouter.get('/', (req, res) => {
  res.render('edit', {
    data: {
      ...res.data,
      user: req.session.user,
    }
  })
})

export default editRouter