import { Router } from 'express'
import db from '../helper/db'
import helper from '../helper'

const entryRouter = Router()
const { Entry } = db

function FormatEntry(ent) {
  let newEntry = {}
  newEntry.id = ent.id
  newEntry.grantorName = ent.grantorName
  newEntry.granteeName = ent.granteeName
  newEntry.granteePosition = ent.granteePosition
  newEntry.travelDeparture = ent.travelDeparture
  newEntry.travelDestination = ent.travelDestination
  newEntry.travelType = ent.travelType
  newEntry.travelReason = ent.travelReason
  newEntry.travelArrival = ent.travelArrival
  newEntry.travelArrivalDate = ent.travelArrivalDate
  newEntry.travelDate = ent.travelDate
  newEntry.travelLength = ent.travelLength
  newEntry.guarantorName = ent.guarantorName
  newEntry.otherInfo = ent.otherInfo
  newEntry.numPrefix = ent.numPrefix
  newEntry.numMiddle = ent.numMiddle
  newEntry.numPostfix = ent.numPostfix
  newEntry.numYear = ent.numYear
  newEntry.numCombined = (ent.numCombined == undefined || ent.numCombined == "") ? ent.numPrefix + ent.numMiddle + ent.numPostfix + ent.numYear : ent.numCombined
  newEntry.userId = ent.userId
  newEntry.empty = ''

  return newEntry
}

entryRouter.post('/', (req, res) => {
  process.nextTick(() => {
    let newEntry = FormatEntry(req.body)
    newEntry.userId = req.session.user.id
    delete newEntry.id

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
    let start = parseInt(req.body.start, 10)
    let limit = parseInt(req.body.length, 10)
    let results = []
    let xOc = parseInt(req.body.order[0].column, 10)
    let xOcName = req.body.columns[xOc].data
    let xOd = req.body.order[0].dir
    Entry.findAndCountAll(
      {
        where: {},
        offset: start,
        limit: limit,
        order: [
          [xOcName, xOd]
        ]
      }
    )
    .then((data) => {
      data.rows.forEach((v, i) => {
        results.push(FormatEntry(v))
      })
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

// entryRouter.delete('/:id', (req, res) => {

// })

export default entryRouter