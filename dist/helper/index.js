"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.helper = exports.APP_OPTIONS = void 0;

var _env = require("../env");

var _api = _interopRequireDefault(require("../api"));

var _configs = _interopRequireDefault(require("../configs"));

var _logger = _interopRequireDefault(require("../logger"));

var _sessionHelper = require("./sessionHelper");

var _admin = _interopRequireDefault(require("../routers/admin"));

var _auth = _interopRequireDefault(require("../routers/auth"));

var _edit = _interopRequireDefault(require("../routers/edit"));

var _db = _interopRequireWildcard(require("./db"));

var _alert = require("./css/alert");

var _migration = _interopRequireDefault(require("../routers/migration"));

var _entry = _interopRequireDefault(require("./entry"));

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var APP_OPTIONS_FILE = JSON.parse(_fs["default"].readFileSync(_path["default"].join(__dirname, '../../app_options.json'), 'utf8'));
var APP_OPTIONS = {
  PREFIX_ZEROS: APP_OPTIONS_FILE['PREFIX_ZEROS'],
  GENERATOR_URL_ACTIVE: APP_OPTIONS_FILE['GENERATOR_URL_ACTIVE'],
  GENERATOR_URL: APP_OPTIONS_FILE['GENERATOR_URL']
};
exports.APP_OPTIONS = APP_OPTIONS;

var validValue = function validValue(val) {
  return val != '' && val != undefined;
};

var routers = {
  api: _api["default"],
  routerAdmin: _admin["default"],
  routerAuth: _auth["default"],
  editRouter: _edit["default"],
  migrationRouter: _migration["default"]
};
var funct = {
  checkSession: _sessionHelper.checkSession,
  checkSessionApi: _sessionHelper.checkSessionApi,
  validValue: validValue,
  FormatEntry: _entry["default"],
  migrateDatabase: _db.migrateDatabase
};
var css = {
  ALERT: _alert.ALERT
};
var helper = {
  env: _env.env,
  routers: routers,
  configs: _configs["default"],
  logger: _logger["default"],
  db: _db["default"],
  sessionStorage: _db.sessionStorage,
  funct: funct,
  css: css,
  APP_OPTIONS: APP_OPTIONS
};
exports.helper = helper;
var _default = helper;
exports["default"] = _default;
//# sourceMappingURL=index.js.map