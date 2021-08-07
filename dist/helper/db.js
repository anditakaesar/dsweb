"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.migrateDatabase = exports.sessionStorage = void 0;

var _expressSession = _interopRequireDefault(require("express-session"));

var _umzug = _interopRequireDefault(require("umzug"));

var _sequelize = _interopRequireDefault(require("sequelize"));

var _errorHelper = _interopRequireDefault(require("./errorHelper"));

var _logger = _interopRequireDefault(require("../logger"));

var db = require('../../models');

var SequelizeStore = require('connect-session-sequelize')(_expressSession["default"].Store);

var sessionStorage = new SequelizeStore({
  db: db.sequelize
});
exports.sessionStorage = sessionStorage;
var sequelize = db.sequelize;
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

var migrateDatabase = function migrateDatabase() {
  var migrations = [];
  umzug.up().then(function (mgs) {
    mgs.forEach(function (v, i) {
      migrations.push(v.file);
    });

    if (migrations.length > 0) {
      _logger["default"].info('migration complete', {
        migrations: migrations
      });
    }

    return migrations;
  })["catch"](function (err) {
    _logger["default"].error(err.message, (0, _errorHelper["default"])(err, null));

    return migrations;
  });
};

exports.migrateDatabase = migrateDatabase;
var _default = db;
exports["default"] = _default;
//# sourceMappingURL=db.js.map