"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _helper = _interopRequireDefault(require("../helper"));

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _user = _interopRequireDefault(require("./user"));

var _config = _interopRequireDefault(require("./config.api"));

var _entry = _interopRequireDefault(require("./entry.api"));

var api = (0, _express.Router)();
api.use('/user', _user["default"]);
api.use('/config', _config["default"]);
api.use('/entry', _entry["default"]);
api.get('/', function (req, res) {
  res.status(200).json({
    message: 'api connect'
  });
});
api.get('/log', function (req, res) {
  _helper["default"].logger.info('invoked logging');

  res.status(200).json({
    message: 'invoking log',
    value: Math.random()
  });
});
api.get('/passgen', function (req, res) {
  if (req.query.s !== undefined) {
    _bcrypt["default"].hash(req.query.s, _helper["default"].env.SALT_HASH).then(function (hash) {
      res.json({
        message: 'done',
        hash: hash
      });
    })["catch"](function (err) {
      res.json({
        message: 'error',
        err: err.message
      });
    });
  } else {
    res.json({
      message: 'param required'
    });
  }
});
var _default = api;
exports["default"] = _default;
//# sourceMappingURL=index.js.map