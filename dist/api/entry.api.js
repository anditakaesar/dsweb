"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _express = require("express");

var _db = _interopRequireDefault(require("../helper/db"));

var _helper = _interopRequireWildcard(require("../helper"));

var _sequelize = require("sequelize");

var _entry = _interopRequireDefault(require("../helper/entry"));

var _errorHelper = _interopRequireDefault(require("../helper/errorHelper"));

var _edit = require("../routers/edit");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var entryRouter = (0, _express.Router)();
var Entry = _db["default"].Entry;

function AddPositionName(entry) {
  var position = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var granteePositionName = (0, _edit.getPositionName)(entry, 'granteePosition', position);

  var newEntry = _objectSpread(_objectSpread({}, entry), {}, {
    granteePositionName: granteePositionName
  });

  return newEntry;
}

function FormatEntryTable(entry) {
  var position = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var newEntry = (0, _entry["default"])(entry);
  newEntry = AddPositionName(newEntry, position);
  return newEntry;
}

function AddZeros(prefixZeros, num) {
  if (prefixZeros != undefined && prefixZeros != null && prefixZeros.length > 0 && num != undefined && num != null && num > 0) {
    return (prefixZeros + num).slice(-prefixZeros.length);
  } else {
    return 'NULL';
  }
}

var NewPrefix = function NewPrefix(req, res, next) {
  res.data.prefix = 'NNN';
  var options = {
    where: _sequelize.Sequelize.where(_sequelize.Sequelize.fn('strftime', '%Y', _sequelize.Sequelize.col('createdAt')), _sequelize.Sequelize.fn('strftime', '%Y', 'now'))
  };
  Entry.max('numPrefix', options).then(function (numPrefix) {
    if (numPrefix) {
      var lastPrefix = parseInt(numPrefix, 10);
      lastPrefix = isNaN(lastPrefix) ? 0 : lastPrefix;
      var newPrefix = AddZeros(_helper.APP_OPTIONS.PREFIX_ZEROS, lastPrefix + 1);
      res.data.prefix = newPrefix;
    } else {
      res.data.prefix = AddZeros(_helper.APP_OPTIONS.PREFIX_ZEROS, 1);
    }

    next();
  })["catch"](function (err) {
    _helper["default"].logger.error('NewPrefix ' + err.message, (0, _errorHelper["default"])(err, req));

    next(err);
  });
};

entryRouter.post('/', NewPrefix, function (req, res) {
  var newEntry = (0, _entry["default"])(req.body);
  newEntry.userId = req.session.user.id;
  newEntry.numPrefix = res.data.prefix;
  delete newEntry.id;
  delete newEntry.empty;
  Entry.create(newEntry).then(function (ent) {
    res.json({
      message: 'save success',
      messageType: 'success',
      data: (0, _entry["default"])(ent)
    });
  })["catch"](function (err) {
    _helper["default"].logger.error(err.message, (0, _errorHelper["default"])(err, req));

    res.json({
      message: "error: ".concat(err.message),
      messageType: 'danger'
    });
  });
});
entryRouter.get('/all', function (req, res) {
  process.nextTick(function () {
    Entry.findAndCountAll().then(function (results) {
      var entries = [];
      results.rows.forEach(function (entry, i) {
        entries.push((0, _entry["default"])(entry));
      });
      res.json({
        message: 'all entries loaded',
        entries: entries,
        count: results.count
      });
    })["catch"](function (err) {
      _helper["default"].logger.error(err.message, (0, _errorHelper["default"])(err, req));

      res.json({
        message: 'error',
        errmsg: err.message
      });
    });
  });
});
entryRouter.post('/dt', _edit.getPosition, function (req, res) {
  process.nextTick(function () {
    var draw = parseInt(req.body.draw, 10);
    var offset = parseInt(req.body.start, 10);
    var limit = parseInt(req.body.length, 10);
    var xOc = parseInt(req.body.order[0].column, 10);
    var xOcName = req.body.columns[xOc].data;
    var xOd = req.body.order[0].dir;
    var order = [[xOcName, xOd]];
    var results = [];
    var where = {};

    if (Object.keys(req.query).length != 0) {
      // { no: '001', name: 'andita', from: '2021-07-23', to: '2021-07-24' }
      where[_sequelize.Op.or] = [];

      if (_helper["default"].funct.validValue(req.query.no)) {
        where[_sequelize.Op.or].push({
          numPrefix: (0, _defineProperty2["default"])({}, _sequelize.Op.like, "%".concat(req.query.no, "%"))
        });
      }

      if (_helper["default"].funct.validValue(req.query.name)) {
        var qName = req.query.name.toLowerCase();

        where[_sequelize.Op.or].push(_sequelize.Sequelize.where(_sequelize.Sequelize.fn('lower', _sequelize.Sequelize.col('granteeName')), (0, _defineProperty2["default"])({}, _sequelize.Op.like, "%".concat(qName, "%"))));
      }

      if (_helper["default"].funct.validValue(req.query.pos)) {
        where[_sequelize.Op.or].push({
          granteePosition: req.query.pos
        });
      }

      if (_helper["default"].funct.validValue(req.query.from)) {
        where[_sequelize.Op.or].push({
          travelDate: (0, _defineProperty2["default"])({}, _sequelize.Op.gte, req.query.from)
        });

        if (_helper["default"].funct.validValue(req.query.to)) {
          where[_sequelize.Op.or].pop();

          where[_sequelize.Op.or].push({
            travelDate: (0, _defineProperty2["default"])({}, _sequelize.Op.and, [(0, _defineProperty2["default"])({}, _sequelize.Op.gte, req.query.from), (0, _defineProperty2["default"])({}, _sequelize.Op.lte, req.query.to)])
          });
        }
      } else if (_helper["default"].funct.validValue(req.query.to)) {
        where[_sequelize.Op.or].push({
          travelDate: (0, _defineProperty2["default"])({}, _sequelize.Op.lte, req.query.to)
        });
      }
    }

    Entry.findAndCountAll({
      where: where,
      offset: offset,
      limit: limit,
      order: order
    }).then(function (data) {
      data.rows.forEach(function (v, i) {
        results.push(FormatEntryTable(v, res.data.position));
      }); // console.log('ENTRY', results)

      res.json({
        draw: draw,
        recordsTotal: data.count,
        recordsFiltered: data.count,
        data: results
      });
    })["catch"](function (err) {
      _helper["default"].logger.error(err.message, (0, _errorHelper["default"])(err, req));

      res.json({
        message: 'error',
        errmsg: err.message
      });
    });
  });
});
entryRouter.post('/:id', function (req, res) {
  process.nextTick(function () {
    var editedEntry = (0, _entry["default"])(req.body);
    editedEntry.userId = req.session.user.id;
    delete editedEntry.id;
    delete editedEntry.empty;
    Entry.findByPk(req.params.id).then(function (entry) {
      entry.update(editedEntry);
      res.json({
        message: "Entry ".concat(editedEntry.numCombined, " updated"),
        messageType: 'success',
        data: editedEntry
      });
    })["catch"](function (err) {
      _helper["default"].logger.error(err.message, (0, _errorHelper["default"])(err, req));

      res.json({
        message: 'error',
        errmsg: err.message
      });
    });
  });
});
entryRouter.get('/:id', function (req, res) {
  process.nextTick(function () {
    Entry.findByPk(req.params.id).then(function (entry) {
      var data = (0, _entry["default"])(entry);
      res.json({
        message: 'entry loaded',
        messageType: 'primary',
        data: data
      });
    })["catch"](function (err) {
      _helper["default"].logger.error(err.message, (0, _errorHelper["default"])(err, req));

      res.json({
        message: 'error',
        errmsg: err.message
      });
    });
  });
});
entryRouter["delete"]('/:id', function (req, res) {
  process.nextTick(function () {
    Entry.destroy({
      where: {
        id: req.params.id
      }
    }).then(function (result) {
      res.json({
        message: "entry with id ".concat(req.params.id, " deleted!"),
        messageType: 'danger'
      });
    })["catch"](function (err) {
      _helper["default"].logger.error(err.message, (0, _errorHelper["default"])(err, req));

      res.json({
        message: 'error',
        errmsg: err.message
      });
    });
  });
});
var _default = entryRouter;
exports["default"] = _default;
//# sourceMappingURL=entry.api.js.map