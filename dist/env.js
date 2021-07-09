"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.env = exports.SALT_HASH = exports.COOKIES_SECRET = exports.SESSION_AGESEC = exports.SESSION_NAME = exports.PORT = exports.NODE_ENV = void 0;
var NODE_ENV = process.env.NODE_ENV || 'development';
exports.NODE_ENV = NODE_ENV;
var PORT = parseInt(process.env.PORT, 10) || 3000;
exports.PORT = PORT;
var SESSION_NAME = process.env.SESSION_NAME || '_ab61dcpz8e7';
exports.SESSION_NAME = SESSION_NAME;
var SESSION_AGESEC = parseInt(process.env.SESSION_AGESEC, 10) || 86400;
exports.SESSION_AGESEC = SESSION_AGESEC;
var COOKIES_SECRET = process.env.COOKIES_SECRET || 'sshhhhhhh';
exports.COOKIES_SECRET = COOKIES_SECRET;
var SALT_HASH = 11;
exports.SALT_HASH = SALT_HASH;
var env = {
  NODE_ENV: NODE_ENV,
  PORT: PORT,
  SESSION_NAME: SESSION_NAME,
  SESSION_AGESEC: SESSION_AGESEC,
  COOKIES_SECRET: COOKIES_SECRET,
  SALT_HASH: SALT_HASH
};
exports.env = env;
var _default = env;
exports["default"] = _default;
//# sourceMappingURL=env.js.map