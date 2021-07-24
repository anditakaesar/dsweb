"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _roles = require("../helper/constants/roles");

var _db = _interopRequireDefault(require("../helper/db"));

var _entry = _interopRequireDefault(require("../helper/entry"));

var _handlebars = _interopRequireDefault(require("handlebars"));

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var editRouter = (0, _express.Router)();
var Entry = _db["default"].Entry;

var puppeteer = require('puppeteer');

editRouter.use(function (req, res, next) {
  if (req.session.user.role === _roles.ROLES.STAFF) {
    next();
  } else {
    res.data.message = 'Unauthorized';
    res.render('error', {
      data: _objectSpread(_objectSpread({}, res.data), {}, {
        user: req.session.user
      })
    });
  }
});
editRouter.get('/', function (req, res) {
  res.render('edit', {
    data: _objectSpread(_objectSpread({}, res.data), {}, {
      user: req.session.user
    })
  });
});
editRouter.get('/list', function (req, res) {
  res.render('edit-listing', {
    data: _objectSpread(_objectSpread({}, res.data), {}, {
      user: req.session.user
    })
  });
});

function createPDF(_x) {
  return _createPDF.apply(this, arguments);
}

function _createPDF() {
  _createPDF = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(entry) {
    var templateHtml, template, html, browser, page, pdf;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            templateHtml = _fs["default"].readFileSync(_path["default"].join(process.cwd(), 'views', 'doc_template.hbs'), 'utf-8');
            template = _handlebars["default"].compile(templateHtml);
            html = template((0, _entry["default"])(entry));
            _context.next = 5;
            return puppeteer.launch({
              args: ['--no-sandbox'],
              headless: true
            });

          case 5:
            browser = _context.sent;
            _context.next = 8;
            return browser.newPage();

          case 8:
            page = _context.sent;
            _context.next = 11;
            return page["goto"]("data:text/html;charset=UTF-8,".concat(html), {
              waitUntil: 'networkidle0'
            });

          case 11:
            _context.next = 13;
            return page.pdf();

          case 13:
            pdf = _context.sent;
            _context.next = 16;
            return browser.close();

          case 16:
            return _context.abrupt("return", pdf);

          case 17:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _createPDF.apply(this, arguments);
}

editRouter.get('/pdf/:id', function (req, res) {
  process.nextTick(function () {
    Entry.findByPk(req.params.id).then(function (entry) {
      createPDF(entry).then(function (pdf) {
        res.set({
          'Content-Type': 'application/pdf',
          'Content-Length': pdf.length
        });
        res.send(pdf);
      });
    })["catch"](function (err) {
      res.json({
        message: 'error',
        errmsg: err.message
      });
    });
  });
});
var _default = editRouter;
exports["default"] = _default;
//# sourceMappingURL=edit.js.map