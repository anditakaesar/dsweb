import { Router } from 'express'
import db from '../helper/db'
import helper, { APP_OPTIONS } from '../helper'
import { Op, Sequelize } from 'sequelize'
import FormatEntry from '../helper/entry'
import genError from '../helper/errorHelper'
import { getPosition, getPositionName } from '../routers/edit'

const entryRouter = Router()
const { Entry } = db

function AddPositionName(entry, position = []) {
  let granteePositionName = getPositionName(entry, 'granteePosition', position)
  let newEntry = {
    ...entry,
    granteePositionName
  }

  return newEntry
}

function FormatEntryTable(entry, position = []) {
  let newEntry = FormatEntry(entry)
  newEntry = AddPositionName(newEntry, position)

  return newEntry
}

function AddZeros(prefixZeros, num) {
  if (prefixZeros != undefined
    && prefixZeros != null
    && prefixZeros.length > 0
    && num != undefined
    && num != null
    && num > 0) {
    return (prefixZeros + num).slice(-prefixZeros.length)
  } else {
    return 'NULL'
  }
}

const NewPrefix = (req, res, next) => {
  res.data.prefix = 'NNN'
  let options = {
    where: Sequelize.where(
    Sequelize.fn('strftime', '%Y', Sequelize.col('createdAt')),
    Sequelize.fn('strftime', '%Y', 'now')
  )}

  Entry.max('numPrefix', options)
    .then((numPrefix) => {
      if (numPrefix) {
        let lastPrefix = parseInt(numPrefix, 10)
        lastPrefix = isNaN(lastPrefix) ? 0 : lastPrefix
        let newPrefix = AddZeros(APP_OPTIONS.PREFIX_ZEROS, lastPrefix + 1)
        res.data.prefix = newPrefix
      } else {
        res.data.prefix = AddZeros(APP_OPTIONS.PREFIX_ZEROS, 1)
      }
      next()
    })
    .catch((err) => {
      helper.logger.error('NewPrefix ' + err.message, genError(err, req))
      next(err)
    })
}

entryRouter.post('/', NewPrefix, (req, res) => {
  req.body.numPrefix = res.data.prefix
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
      helper.logger.error(err.message, genError(err, req))
      res.json({
        message: `error: ${err.message}`,
        messageType: 'danger'
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
        helper.logger.error(err.message, genError(err, req))
        res.json({
          message: 'error',
          errmsg: err.message,
        })
      })
  })
})

entryRouter.post('/dt', getPosition, (req, res) => {
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

      if (helper.funct.validValue(req.query.pos)) {
        where[Op.or].push(
          {
            granteePosition: req.query.pos
          }
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
          results.push(FormatEntryTable(v, res.data.position))
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
        helper.logger.error(err.message, genError(err, req))
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
        helper.logger.error(err.message, genError(err, req))
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
        helper.logger.error(err.message, genError(err, req))
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
        helper.logger.error(err.message, genError(err, req))
        res.json({
          message: 'error',
          errmsg: err.message,
        })
      })
  })
})

export default entryRouter