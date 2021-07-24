import { Router } from 'express'
import db from '../helper/db'
import helper from '../helper'
import { Op, Sequelize } from 'sequelize'
import FormatEntry from '../helper/entry'

const entryRouter = Router()
const { Entry } = db

entryRouter.post('/', (req, res) => {
  process.nextTick(() => {
    let newEntry = FormatEntry(req.body)
    newEntry.userId = req.session.user.id
    delete newEntry.id
    delete newEntry.empty

    Entry.create(newEntry)
      .then((ent) => {
        res.json({
          message: 'save success',
          messageType: 'success',
          data: FormatEntry(ent)
        })
      })
      .catch((err) => {
        res.json({
          message: `error: ${err.message}`,
          messageType: 'danger'
        })
      })

  })
})

entryRouter.get('/all', (req, res) => {
  process.nextTick(() => {
    Entry.findAndCountAll()
      .then((results) => {
        let entries = []
        results.rows.forEach((entry, i) => {
          entries.push(FormatEntry(entry))
        })
        res.json({
          message: 'all entries loaded',
          entries,
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

entryRouter.post('/dt', (req, res) => {
  process.nextTick(() => {
    let draw = parseInt(req.body.draw, 10)
    let offset = parseInt(req.body.start, 10)
    let limit = parseInt(req.body.length, 10)
    let xOc = parseInt(req.body.order[0].column, 10)
    let xOcName = req.body.columns[xOc].data
    let xOd = req.body.order[0].dir
    let order = [[xOcName, xOd]]
    let results = []
    let where = {}
    if (Object.keys(req.query).length != 0) {
      // { no: '001', name: 'andita', from: '2021-07-23', to: '2021-07-24' }
      where[Op.or] = []
      if (helper.funct.validValue(req.query.no)) {
        where[Op.or].push({
          numPrefix: {
            [Op.like]: `%${req.query.no}%`
          }
        })
      }

      if (helper.funct.validValue(req.query.name)) {
        let qName = req.query.name.toLowerCase();
        where[Op.or].push(
          Sequelize.where(
            Sequelize.fn('lower', Sequelize.col('granteeName')), { [Op.like]: `%${qName}%` }
          )
        )
      }

      if (helper.funct.validValue(req.query.from)) {
        where[Op.or].push(
          {
            travelDate: {
              [Op.gte]: req.query.from
            }
          }
        )

        if (helper.funct.validValue(req.query.to)) {
          where[Op.or].pop()
          where[Op.or].push(
            {
              travelDate: {
                [Op.and]: [
                  { [Op.gte]: req.query.from },
                  { [Op.lte]: req.query.to }
                ]
              }
            }
          )
        }

      } else if (helper.funct.validValue(req.query.to)) {
        where[Op.or].push(
          {
            travelDate: {
              [Op.lte]: req.query.to
            }
          }
        )
      }

    }

    Entry.findAndCountAll(
      {
        where,
        offset,
        limit,
        order,
      }
    )
      .then((data) => {
        data.rows.forEach((v, i) => {
          results.push(FormatEntry(v))
        })
        // console.log('ENTRY', results)
        res.json({
          draw,
          recordsTotal: data.count,
          recordsFiltered: data.count,
          data: results
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

entryRouter.post('/:id', (req, res) => {
  process.nextTick(() => {
    let editedEntry = FormatEntry(req.body)
    editedEntry.userId = req.session.user.id
    delete editedEntry.id
    delete editedEntry.empty

    Entry.findByPk(req.params.id)
      .then((entry) => {
        entry.update(editedEntry)
        res.json({
          message: `Entry ${editedEntry.numCombined} updated`,
          messageType: 'success',
          data: editedEntry
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

entryRouter.get('/:id', (req, res) => {
  process.nextTick(() => {
    Entry.findByPk(req.params.id)
      .then((entry) => {
        let data = FormatEntry(entry)
        res.json({
          message: 'entry loaded',
          messageType: 'primary',
          data,
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

entryRouter.delete('/:id', (req, res) => {
  process.nextTick(() => {
    Entry.destroy({
      where: {
        id: req.params.id
      }
    })
      .then((result) => {
        res.json({
          message: `entry with id ${req.params.id} deleted!`,
          messageType: 'danger',
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

export default entryRouter