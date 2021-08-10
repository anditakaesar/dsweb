import { Router } from 'express'
import { ROLES } from '../helper/constants/roles'
import db from '../helper/db'
import FormatEntry, { FormatPDFName, FormatPosition, FormatTravelType } from '../helper/entry'
import handlebars from 'handlebars'
import fs from 'fs'
import path from 'path'
import moment from 'moment'
import { Op } from 'sequelize'
import { PDFDocument } from 'pdf-lib'
import helper from '../helper'
import genError from '../helper/errorHelper'

const editRouter = Router()
const { Entry, Position, TravelType } = db
const puppeteer = require('puppeteer')

export const getPosition = (req, res, next) => {
  res.data.position = []
  Position.findAll()
    .then((posdata) => {
      posdata.forEach((pos, i) => {
        res.data.position.push(FormatPosition(pos))
      })
      next()
    })
    .catch((err) => {
      helper.logger.error(err.message, genError(err, req))
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
      helper.logger.error(err.message, genError(err, req))
      res.json({
        message: 'Error edit/getPosition',
        error: err
      })
    })
}

export const getPositionName = (entry, fieldNames, position = []) => {
  let pos = position.find(p => p.positionCode == entry[fieldNames])
  return pos ? pos.positionName : ""
}

const getTravelTypeName = (entry, travelType = []) => {
  let trv = travelType.find(t => t.id == entry.travelLengthType)
  return trv ? trv.travelName : ""
}

const formatDate = (rawStrDate, formatStr = 'DD-MM-YYYY') => {
  let rawDate = moment(rawStrDate)
  return rawDate.format(formatStr)
}

const getEntries = (req, res, next) => {
  res.data.entries = []
  process.nextTick(() => {
    let arrIds = req.query.ids.split(',')
    if (arrIds.length > 0) {
      Entry.findAll({
        where: {
          id: { [Op.in]: arrIds }
        }
      })
        .then((data) => {
          data.forEach((ent, i) => {
            res.data.entries.push(FormatEntry(ent))
          })
          next()
        })
        .catch((err) => {
          helper.logger.error(err.message, genError(err, req))
          res.json({
            message: 'error on edit/getEntries',
            error: err
          })
        })

    } else {
      res.data.message = 'No data selected'
      res.render('error', {
        data: {
          ...res.data,
          user: req.session.user,
        }
      })
    }
  })
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

function createBasePage(entry, res) {
  let templateHtml = fs.readFileSync(path.join(process.cwd(), 'views', 'doc_template.hbs'), 'utf-8')
  let template = handlebars.compile(templateHtml)
  let loadedEntry = FormatEntry(entry)
  loadedEntry.grantorPosition = getPositionName(entry, 'grantorPosition', res.data.position)
  loadedEntry.granteePosition = getPositionName(entry, 'granteePosition', res.data.position)
  loadedEntry.travelLengthType = getTravelTypeName(entry, res.data.travelType)
  loadedEntry.travelDate = formatDate(loadedEntry.travelDate)
  loadedEntry.travelDateBack = formatDate(loadedEntry.travelDateBack)
  loadedEntry.travelArrivalDate = formatDate(loadedEntry.travelArrivalDate)
  let html = template(loadedEntry)

  return html
}

async function createPDF(entry, res) {
  let html = createBasePage(entry, res)

  const browser = await puppeteer.launch({ args: ['--no-sandbox'], headless: true })
  let page = await browser.newPage();
  await page.goto(`data:text/html;charset=UTF-8,${html}`, {
    waitUntil: 'networkidle0'
  })

  const pdf = await page.pdf()
  await browser.close()

  return pdf
}

async function mergePdf(entries = [], res) {
  if (entries.length > 0) {
    let pdfsToMerge = []
    for (const entry of entries) {
      let singlePdf = await createPDF(entry, res)
      pdfsToMerge.push(singlePdf)
    }
    const mergedPdf = await PDFDocument.create()
    for (const pdfBytes of pdfsToMerge) {
      const pdf = await PDFDocument.load(pdfBytes)
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
      copiedPages.forEach((page) => {
        mergedPdf.addPage(page)
      })
    }

    const buf = await mergedPdf.save()
    return buf.buffer
  } else {
    return null
  }
}

editRouter.get('/pdf/combined', getEntries, (req, res) => {
  // res.data.entries
  process.nextTick(() => {
    mergePdf(res.data.entries, res)
      .then((merged) => {
        res.set({
          'Content-Type': 'application/pdf',
          'Content-Length': merged.length,
          'Content-disposition': `inline; filename=${moment().format("YYYYMMDD")}_SURAT_PERINTAH_PERJALANAN_DINAS_combined.pdf`
        })
        res.send(Buffer.from(merged, 'utf8'))
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
          .catch((err) => {
            helper.logger.error(err.message, genError(err, req))
            res.json({
              message: 'error',
              errmsg: err.message,
            })
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

export default editRouter