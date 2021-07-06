export const NODE_ENV = process.env.NODE_ENV || 'development'
export const PORT = parseInt(process.env.PORT, 10) || 3000
export const SESSION_NAME = process.env.SESSION_NAME || '_ab61dcpz8e7'
export const SESSION_AGESEC = parseInt(process.env.SESSION_AGESEC, 10) || 86400
export const COOKIES_SECRET = process.env.COOKIES_SECRET || 'sshhhhhhh'
export const SALT_HASH = 11

export const env = {
  NODE_ENV, PORT, SESSION_NAME, SESSION_AGESEC, COOKIES_SECRET,
  SALT_HASH,
}

export default env