import { env } from '../env'
import api from '../api'
import configs from '../configs'
import logger from '../logger'
import { checkSession, checkSessionApi } from './sessionHelper'
import routerAdmin from '../routers/admin'
import routerAuth from '../routers/auth'
import editRouter from '../routers/edit'
import db, { sessionStorage, migrateDatabase } from './db'
import { ALERT } from './css/alert'
import migrationRouter from '../routers/migration'
import FormatEntry from './entry'
import fs from 'fs'
import path from 'path'

const APP_OPTIONS_FILE = JSON.parse(fs.readFileSync(path.join(__dirname, '../../app_options.json'), 'utf8'))
export const APP_OPTIONS = {
  PREFIX_ZEROS: APP_OPTIONS_FILE['PREFIX_ZEROS'],
  GENERATOR_URL_ACTIVE: APP_OPTIONS_FILE['GENERATOR_URL_ACTIVE'],
  GENERATOR_URL: APP_OPTIONS_FILE['GENERATOR_URL']
}

const validValue = (val) => {
  return (val != '' && val != undefined)
}

const routers = {
  api, routerAdmin, routerAuth,
  editRouter, migrationRouter,
}

const funct = {
  checkSession, checkSessionApi, validValue, FormatEntry, migrateDatabase
}

const css = {
  ALERT,
}

export const helper = {
  env, routers, configs, logger, 
  db, sessionStorage, funct,
  css, APP_OPTIONS
}

export default helper