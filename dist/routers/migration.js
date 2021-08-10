"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _umzug = _interopRequireDefault(require("umzug"));

var _sequelize = _interopRequireDefault(require("sequelize"));

var _db = _interopRequireWildcard(require("../helper/db"));

var _logger = _interopRequireDefault(require("../logger"));

var _env = _interopRequireDefault(require("../env"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

var router = (0, _express.Router)();
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
    var migrations = (0, _db.migrateDatabase)();
    res.json({
      message: 'migration completed',
      migrations: migrations
    });
  });
});
var _default = router;
exports["default"] = _default;
//# sourceMappingURL=migration.js.map