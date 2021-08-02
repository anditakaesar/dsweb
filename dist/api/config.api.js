"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _db = _interopRequireDefault(require("../helper/db"));

var _helper = _interopRequireDefault(require("../helper"));

var _errorHelper = _interopRequireDefault(require("../helper/errorHelper"));

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
      err = (0, _errorHelper["default"])(err, req);

      _helper["default"].logger.error(err.message, err);

      res.json({
        message: "error: ".concat(err.message),
        messageType: 'danger'
      });
    });
  });
});
configRouter.post('/:id', function (req, res, next) {
  if (req.params.id == undefined) {
    var error = (0, _errorHelper["default"])(null, req);
    error.message('params.id required');
    next(error);
  } else {
    next();
  }
}, function (req, res) {
  process.nextTick(function () {
    Config.findOne({
      where: {
        id: req.params.id
      }
    }).then(function (cfg) {
      if (!cfg) {
        throw new Error("no result for id ".concat(req.params.id));
      }

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
      err = (0, _errorHelper["default"])(err, req);

      _helper["default"].logger.error(err.message, err);

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
      err = (0, _errorHelper["default"])(err, req);

      _helper["default"].logger.error(err.message, err);

      res.json({
        message: "error: ".concat(err.message),
        messageType: 'danger'
      });
    });
  });
});
configRouter.get('/:id', function (req, res, next) {
  if (req.params.id == undefined) {
    var error = (0, _errorHelper["default"])(null, req);
    error.message('params.id required');
    next(error);
  } else {
    next();
  }
}, function (req, res) {
  process.nextTick(function () {
    Config.findOne({
      where: {
        id: req.params.id
      }
    }).then(function (result) {
      if (!result) {
        throw new Error("no result for id ".concat(req.params.id));
      }

      res.json({
        message: 'config loaded',
        config: FormatConfig(result)
      });
    })["catch"](function (err) {
      err = (0, _errorHelper["default"])(err, req);

      _helper["default"].logger.error(err.message, err);

      res.json({
        message: 'error',
        errmsg: err.message
      });
    });
  });
});
configRouter["delete"]('/:id', function (req, res, next) {
  if (req.params.id == undefined) {
    var error = (0, _errorHelper["default"])(null, req);
    error.message('params.id required');
    next(error);
  } else {
    next();
  }
}, function (req, res) {
  process.nextTick(function () {
    Config.destroy({
      where: {
        id: req.params.id
      }
    }).then(function (result) {
      if (!result) {
        throw new Error("no result for id ".concat(req.params.id));
      }

      res.json({
        message: 'config deleted',
        messageType: 'danger',
        config: FormatConfig(result)
      });
    })["catch"](function (err) {
      err = (0, _errorHelper["default"])(err, req);

      _helper["default"].logger.error(err.message, err);

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