import { Router } from 'express'
import { ROLES } from '../helper/constants/roles'
import db from '../helper/db'
import FormatEntry, { FormatPDFName, FormatPosition, FormatTravelType } from '../helper/entry'
import handlebars from 'handlebars'
import fs from 'fs'
import path from 'path'

const editRouter = Router()
const { Entry, Position, TravelType } = db
const puppeteer = require('puppeteer')

const getPosition = (req, res, next) => {
  res.data.position = []
  Position.findAll()
    .then((posdata) => {
      posdata.forEach((pos, i) => {
        res.data.position.push(FormatPosition(pos))
      })
      next()
    })
    .catch((err) => {
      res.json({
        message: 'Error edit/getPosition',
        error: err
      })
    })
}

const getTravelType = (req, res, next) => {
  res.data.travelType = []
  TravelType.findAll()
    .then((travdata) => {
      travdata.forEach((trav, i) => {
        res.data.travelType.push(FormatTravelType(trav))
      })
      next()
    })
    .catch((err) => {
      res.json({
        message: 'Error edit/getPosition',
        error: err
      })
    })
}

const getPositionName = (entry, position = []) => {
  let pos = position.find(p => p.positionCode == entry.granteePosition)
  return pos.positionName
}

const getTravelTypeName = (entry, travelType = []) => {
  let trv = travelType.find(t => t.id == entry.travelLengthType)
  return trv.travelName
} 

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
}, getPosition, getTravelType)

editRouter.get('/', (req, res) => {
  res.render('edit', {
    data: {
      ...res.data,
      user: req.session.user,
    }
  })
})

editRouter.get('/list', (req, res) => {
  res.render('edit-listing', {
    data: {
      ...res.data,
      user: req.session.user,
    }
  })
})

async function createPDF(entry, res) {
  let templateHtml = fs.readFileSync(path.join(process.cwd(), 'views', 'doc_template.hbs'), 'utf-8')
  let template = handlebars.compile(templateHtml)
  let loadedEntry = FormatEntry(entry)
  loadedEntry.granteePosition = getPositionName(entry, res.data.position)
  loadedEntry.travelLengthType = getTravelTypeName(entry, res.data.travelType)
  let html = template(loadedEntry)

  const browser = await puppeteer.launch({ args: ['--no-sandbox'], headless: true })
  let page = await browser.newPage();
  await page.goto(`data:text/html;charset=UTF-8,${html}`, {
    waitUntil: 'networkidle0'
  })

  const pdf = await page.pdf()
  await browser.close()
  return pdf
}

editRouter.get('/pdf/:id', (req, res) => {
  process.nextTick(() => {

    Entry.findByPk(req.params.id)
      .then((entry) => {
        createPDF(entry, res)
          .then((pdf) => {
            res.set({
              'Content-Type': 'application/pdf',
              'Content-Length': pdf.length,
              'Content-disposition': `inline; filename=${FormatPDFName(entry)}`
            })
            res.send(pdf)
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

export default editRouter