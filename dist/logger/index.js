"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _winston = _interopRequireWildcard(require("winston"));

var _dateFns = require("date-fns");

var _env = _interopRequireDefault(require("../env"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var VALUES = {
  DATE_FORMAT: 'yyyyMMdd',
  TIME_FORMAT: 'HH:mm:ss.SSS'
};
var combine = _winston.format.combine,
    timestamp = _winston.format.timestamp,
    label = _winston.format.label,
    printf = _winston.format.printf;
var myFormat = printf(function (info) {
  var metas = [];
  Object.keys(info).forEach(function (e) {
    var value = '';

    if (e !== 'timestamp' && e !== 'label' && e !== 'level' && e !== 'message') {
      value = info[e];

      if (value !== '' && value !== undefined) {
        metas.push("".concat(e, ":").concat(value));
      }
    }
  });

  if (info.intmsg !== undefined) {
    metas.push(info.intmsg);
  }

  if (info.request !== undefined) {
    metas.push("req:".concat(info.request));
  }

  var tmp = (0, _dateFns.format)((0, _dateFns.parseISO)(info.timestamp), VALUES.TIME_FORMAT); // metas.push(`[${info.label}]`)

  var strmetas = '';

  if (metas.length > 0) {
    strmetas += '\n';
    strmetas += metas.join('\n');
  }

  return "".concat(tmp, " ").concat(info.level.toUpperCase(), " [").concat(info.label, "] ").concat(info.message).concat(strmetas);
});
var dateStr = (0, _dateFns.format)(new Date(), VALUES.DATE_FORMAT);
var logLevel = _env["default"].NODE_ENV.includes('dev') ? 'debug' : 'info';
var fileConfig = {
  filename: "logs/applog-".concat(dateStr, ".log"),
  level: logLevel,
  format: combine(label({
    label: _env["default"].NODE_ENV.toUpperCase()
  }), timestamp(), myFormat)
};
var consoleConfig = {
  level: logLevel,
  format: combine(label({
    label: _env["default"].NODE_ENV.toUpperCase()
  }), timestamp(), myFormat)
};

function createNewLogger() {
  if (_env["default"].NODE_ENV === 'production') {
    return new _winston["default"].createLogger({
      transports: [new _winston["default"].transports.File(fileConfig)]
    });
  }

  return new _winston["default"].createLogger({
    transports: [new _winston["default"].transports.Console(consoleConfig), new _winston["default"].transports.File(fileConfig)]
  });
}

var logger = createNewLogger();
var _default = logger;
exports["default"] = _default;
//# sourceMappingURL=index.js.map