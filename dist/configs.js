"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _expressHandlebars = _interopRequireDefault(require("express-handlebars"));

var _path = _interopRequireDefault(require("path"));

var _env = _interopRequireDefault(require("./env"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var hbs = _expressHandlebars["default"].create({
  extname: 'hbs',
  defaultLayout: 'default',
  layoutsDir: _path["default"].join(__dirname, '../views/layouts'),
  partialsDir: _path["default"].join(__dirname, '../views/partials')
});

var sessionCookieConfig = {
  maxAge: _env["default"].SESSION_AGESEC * 1000,
  secure: false,
  httpOnly: true,
  sameSite: true
};
var configs = {
  hbs: hbs,
  sessionCookieConfig: sessionCookieConfig
};
var _default = configs;
exports["default"] = _default;
//# sourceMappingURL=configs.js.map