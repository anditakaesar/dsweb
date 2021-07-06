import { env } from '../env'
import api from '../api'
import configs from '../configs'
import logger from '../logger'
import { checkSession, checkSessionApi } from './sessionHelper'
import routerAdmin from '../routers/admin'
import routerAuth from '../routers/auth'
import editRouter from '../routers/edit'
import db, { sessionStorage } from './db'
import { ALERT } from './css/alert'

const routers = {
  api, routerAdmin, routerAuth,
  editRouter,
}

const funct = {
  checkSession, checkSessionApi,
}

const css = {
  ALERT,
}

export const helper = {
  env, routers, configs, logger, 
  db, sessionStorage, funct,
  css,
}

export default helper