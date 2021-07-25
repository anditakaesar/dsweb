import { Router } from 'express'
import { ROLES } from '../helper/constants/roles'
import db from '../helper/db'
import FormatEntry from '../helper/entry'
import handlebars from 'handlebars'
import fs from 'fs'
import path from 'path'

const editRouter = Router()
const { Entry } = db
const puppeteer = require('puppeteer')

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

editRouter.get('/list', (req, res) => {
  res.render('edit-listing', {
    data: {
      ...res.data,
      user: req.session.user,
    }
  })
})

async function createPDF(entry) {
  let templateHtml = fs.readFileSync(path.join(process.cwd(), 'views', 'doc_template.hbs'), 'utf-8')
  let template = handlebars.compile(templateHtml)
  let html = template(FormatEntry(entry))

  const browser = await puppeteer.launch({ headless: true })
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
        createPDF(entry)
          .then((pdf) => {
            res.set({ 'Content-Type': 'application/pdf', 'Content-Length': pdf.length })
            res.send(pdf)
          })
          .catch((err) => {
            throw err
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