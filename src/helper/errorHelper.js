export const genError = (originalError, req) => {
  if (originalError == undefined || originalError == null) {
    originalError = new Error('Generic Error')
  }
  if (req != undefined) {
    originalError.url = req.originalUrl
    originalError.method = req.method
  }

  return originalError
}

export default genError