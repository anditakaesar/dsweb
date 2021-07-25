"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _db = _interopRequireDefault(require("../helper/db"));

var _helper = _interopRequireDefault(require("../helper"));

var configRouter = (0, _express.Router)();
var Config = _db["default"].Config;

function FormatConfig(cfg) {
  var newConfig = {};
  newConfig.id = cfg.id;
  newConfig.configkey = cfg.configkey;
  newConfig.configvalue = cfg.configvalue;
  return newConfig;
}

configRouter.post('/', function (req, res) {
  process.nextTick(function () {
    Config.create({
      configkey: req.body.configkey,
      configvalue: req.body.configvalue
    }).then(function (cfg) {
      res.json({
        message: 'save success',
        messageType: 'primary',
        data: cfg
      });
    })["catch"](function (err) {
      res.json({
        message: "error: ".concat(err.message),
        messageType: 'danger'
      });
    });
  });
});
configRouter.post('/:id', function (req, res) {
  process.nextTick(function () {
    Config.findOne({
      where: {
        id: req.params.id
      }
    }).then(function (cfg) {
      cfg.update({
        configkey: req.body.configkey,
        configvalue: req.body.configvalue
      });
      res.json({
        message: 'update success',
        messageType: 'success',
        data: cfg
      });
    })["catch"](function (err) {
      res.json({
        message: "error: ".concat(err.message),
        messageType: 'danger'
      });
    });
  });
});
configRouter.get('/all', function (req, res) {
  process.nextTick(function () {
    Config.findAndCountAll().then(function (results) {
      var data = [];
      results.rows.forEach(function (cfg, i) {
        data.push(FormatConfig(cfg));
      });
      res.json({
        message: 'all config loaded',
        messageType: 'primary',
        data: data,
        count: results.count
      });
    })["catch"](function (err) {
      res.json({
        message: "error: ".concat(err.message),
        messageType: 'danger'
      });
    });
  });
});
configRouter.get('/:id', function (req, res) {
  process.nextTick(function () {
    Config.findOne({
      where: {
        id: req.params.id
      }
    }).then(function (result) {
      res.json({
        message: 'config loaded',
        config: FormatConfig(result)
      });
    })["catch"](function (err) {
      res.json({
        message: 'error',
        errmsg: err.message
      });
    });
  });
});
configRouter["delete"]('/:id', function (req, res) {
  process.nextTick(function () {
    Config.destroy({
      where: {
        id: req.params.id
      }
    }).then(function (result) {
      res.json({
        message: 'config deleted',
        messageType: 'danger',
        config: FormatConfig(result)
      });
    })["catch"](function (err) {
      res.json({
        message: 'error',
        errmsg: err.message
      });
    });
  });
});
var _default = configRouter;
exports["default"] = _default;
//# sourceMappingURL=config.api.js.map