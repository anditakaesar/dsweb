"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _db = _interopRequireDefault(require("../helper/db"));

var _helper = _interopRequireDefault(require("../helper"));

var _sequelize = require("sequelize");

var _entry = _interopRequireDefault(require("../helper/entry"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var entryRouter = (0, _express.Router)();
var Entry = _db["default"].Entry;
entryRouter.post('/', function (req, res) {
  process.nextTick(function () {
    var newEntry = (0, _entry["default"])(req.body);
    newEntry.userId = req.session.user.id;
    delete newEntry.id;
    delete newEntry.empty;
    Entry.create(newEntry).then(function (ent) {
      res.json({
        message: 'save success',
        messageType: 'success',
        data: (0, _entry["default"])(ent)
      });
    })["catch"](function (err) {
      res.json({
        message: "error: ".concat(err.message),
        messageType: 'danger'
      });
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
      res.json({
        message: 'error',
        errmsg: err.message
      });
    });
  });
});
entryRouter.post('/dt', function (req, res) {
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
          numPrefix: _defineProperty({}, _sequelize.Op.like, "%".concat(req.query.no, "%"))
        });
      }

      if (_helper["default"].funct.validValue(req.query.name)) {
        var qName = req.query.name.toLowerCase();

        where[_sequelize.Op.or].push(_sequelize.Sequelize.where(_sequelize.Sequelize.fn('lower', _sequelize.Sequelize.col('granteeName')), _defineProperty({}, _sequelize.Op.like, "%".concat(qName, "%"))));
      }

      if (_helper["default"].funct.validValue(req.query.from)) {
        where[_sequelize.Op.or].push({
          travelDate: _defineProperty({}, _sequelize.Op.gte, req.query.from)
        });

        if (_helper["default"].funct.validValue(req.query.to)) {
          where[_sequelize.Op.or].pop();

          where[_sequelize.Op.or].push({
            travelDate: _defineProperty({}, _sequelize.Op.and, [_defineProperty({}, _sequelize.Op.gte, req.query.from), _defineProperty({}, _sequelize.Op.lte, req.query.to)])
          });
        }
      } else if (_helper["default"].funct.validValue(req.query.to)) {
        where[_sequelize.Op.or].push({
          travelDate: _defineProperty({}, _sequelize.Op.lte, req.query.to)
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
        results.push((0, _entry["default"])(v));
      }); // console.log('ENTRY', results)

      res.json({
        draw: draw,
        recordsTotal: data.count,
        recordsFiltered: data.count,
        data: results
      });
    })["catch"](function (err) {
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