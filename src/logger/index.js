import winston, { format } from 'winston'
import { parseISO, format as formatDate } from 'date-fns'
import env from '../env'

const VALUES = {
  DATE_FORMAT: 'yyyyMMdd',
  TIME_FORMAT: 'HH:mm:ss.SSS',
}

const {
  combine, timestamp, label, printf,
} = format

const myFormat = printf((info) => {
  const metas = []
  Object.keys(info).forEach((e) => {
    let value = ''
    if (e !== 'timestamp' && e !== 'label' && e !== 'level' && e !== 'message') {
      value = info[e]
      if (value !== '' && value !== undefined) {
        metas.push(`${e}:${value}`)
      }
    }
  })

  if (info.intmsg !== undefined) {
    metas.push(info.intmsg)
  }

  if (info.request !== undefined) {
    metas.push(`req:${info.request}`)
  }

  const tmp = formatDate(parseISO(info.timestamp), VALUES.TIME_FORMAT)
  // metas.push(`[${info.label}]`)
  let strmetas = ''
  if (metas.length > 0) {
    strmetas += '\n'
    strmetas += metas.join('\n')
  }

  return `${tmp} ${info.level.toUpperCase()} [${info.label}] ${info.message}${strmetas}`
})

const dateStr = formatDate(new Date(), VALUES.DATE_FORMAT)
const logLevel = env.NODE_ENV.includes('dev') ? 'debug' : 'info'

const fileConfig = {
  filename: `logs/applog-${dateStr}.log`,
  level: logLevel,
  format: combine(
    label({ label: env.NODE_ENV.toUpperCase() }),
    timestamp(),
    myFormat,
  ),
}

const consoleConfig = {
  level: logLevel,
  format: combine(
    label({ label: env.NODE_ENV.toUpperCase() }),
    timestamp(),
    myFormat,
  ),
}

function createNewLogger() {
  if (env.NODE_ENV === 'production') {
    return new winston.createLogger({
      transports: [
        new winston.transports.File(fileConfig),
      ],
    })
  }

  return new winston.createLogger({
    transports: [
      new winston.transports.Console(consoleConfig),
      new winston.transports.File(fileConfig),
    ],
  })
}

const logger = createNewLogger()

export default logger