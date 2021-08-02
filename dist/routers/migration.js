"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _umzug = _interopRequireDefault(require("umzug"));

var _sequelize = _interopRequireDefault(require("sequelize"));

var _db = _interopRequireDefault(require("../helper/db"));

var _logger = _interopRequireDefault(require("../logger"));

var _env = _interopRequireDefault(require("../env"));

var _errorHelper = _interopRequireDefault(require("../helper/errorHelper"));

var router = (0, _express.Router)();
var sequelize = _db["default"].sequelize;
var umzug = new _umzug["default"]({
  storage: 'sequelize',
  storageOptions: {
    sequelize: sequelize
  },
  migrations: {
    params: [sequelize.getQueryInterface(), _sequelize["default"]],
    path: './migrations'
  }
});
router.get('/', function (req, res, next) {
  if (req.query.key !== _env["default"].MIGRATION_KEY) {
    _logger["default"].info('migration attempt', {
      key: req.query.key
    });

    res.sendStatus(404);
  } else {
    next();
  }
}, function (req, res, next) {
  process.nextTick(function () {
    var migrations = [];
    umzug.up().then(function (mgs) {
      mgs.forEach(function (v, i) {
        migrations.push(v.file);
      });

      _logger["default"].info('migration complete', {
        migrations: migrations
      });

      res.json({
        message: 'migration completed',
        migrations: migrations
      });
    })["catch"](function (err) {
      _logger["default"].error(err.message, (0, _errorHelper["default"])(err, req));

      next(err);
    });
  });
});
var _default = router;
exports["default"] = _default;
//# sourceMappingURL=migration.js.map