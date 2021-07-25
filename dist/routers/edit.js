"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _express = require("express");

var _roles = require("../helper/constants/roles");

var _db = _interopRequireDefault(require("../helper/db"));

var _entry = _interopRequireDefault(require("../helper/entry"));

var _handlebars = _interopRequireDefault(require("handlebars"));

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

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
  _createPDF = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(entry) {
    var templateHtml, template, html, browser, page, pdf;
    return _regenerator["default"].wrap(function _callee$(_context) {
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