import { Router } from 'express'

const editRouter = Router()

editRouter.get('/', (req, res) => {
  res.render('edit', res.data)
})

export default editRouter