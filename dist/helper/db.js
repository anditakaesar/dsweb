"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.sessionStorage = void 0;

var _expressSession = _interopRequireDefault(require("express-session"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var db = require('../../models');

var SequelizeStore = require('connect-session-sequelize')(_expressSession["default"].Store);

var sessionStorage = new SequelizeStore({
  db: db.sequelize
});
exports.sessionStorage = sessionStorage;
var _default = db;
exports["default"] = _default;
//# sourceMappingURL=db.js.map