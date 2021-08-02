"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _typeof3 = require("@babel/runtime/helpers/typeof");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _express = require("express");

var _roles = require("../helper/constants/roles");

var _db = _interopRequireDefault(require("../helper/db"));

var _entry = _interopRequireWildcard(require("../helper/entry"));

var _handlebars = _interopRequireDefault(require("handlebars"));

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _moment = _interopRequireDefault(require("moment"));

var _sequelize = require("sequelize");

var _pdfLib = require("pdf-lib");

var _helper = _interopRequireDefault(require("../helper"));

var _errorHelper = _interopRequireDefault(require("../helper/errorHelper"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof3(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var editRouter = (0, _express.Router)();
var Entry = _db["default"].Entry,
    Position = _db["default"].Position,
    TravelType = _db["default"].TravelType;

var puppeteer = require('puppeteer');

var getPosition = function getPosition(req, res, next) {
  res.data.position = [];
  Position.findAll().then(function (posdata) {
    posdata.forEach(function (pos, i) {
      res.data.position.push((0, _entry.FormatPosition)(pos));
    });
    next();
  })["catch"](function (err) {
    _helper["default"].logger.error(err.message, (0, _errorHelper["default"])(err, req));

    res.json({
      message: 'Error edit/getPosition',
      error: err
    });
  });
};

var getTravelType = function getTravelType(req, res, next) {
  res.data.travelType = [];
  TravelType.findAll().then(function (travdata) {
    travdata.forEach(function (trav, i) {
      res.data.travelType.push((0, _entry.FormatTravelType)(trav));
    });
    next();
  })["catch"](function (err) {
    _helper["default"].logger.error(err.message, (0, _errorHelper["default"])(err, req));

    res.json({
      message: 'Error edit/getPosition',
      error: err
    });
  });
};

var getPositionName = function getPositionName(entry) {
  var position = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var pos = position.find(function (p) {
    return p.positionCode == entry.granteePosition;
  });
  return pos ? pos.positionName : "";
};

var getTravelTypeName = function getTravelTypeName(entry) {
  var travelType = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  var trv = travelType.find(function (t) {
    return t.id == entry.travelLengthType;
  });
  return trv ? trv.travelName : "";
};

var formatDate = function formatDate(rawStrDate) {
  var formatStr = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'DD-MM-YYYY';
  var rawDate = (0, _moment["default"])(rawStrDate);
  return rawDate.format(formatStr);
};

var getEntries = function getEntries(req, res, next) {
  res.data.entries = [];
  process.nextTick(function () {
    var arrIds = req.query.ids.split(',');

    if (arrIds.length > 0) {
      Entry.findAll({
        where: {
          id: (0, _defineProperty2["default"])({}, _sequelize.Op["in"], arrIds)
        }
      }).then(function (data) {
        data.forEach(function (ent, i) {
          res.data.entries.push((0, _entry["default"])(ent));
        });
        next();
      })["catch"](function (err) {
        _helper["default"].logger.error(err.message, (0, _errorHelper["default"])(err, req));

        res.json({
          message: 'error on edit/getEntries',
          error: err
        });
      });
    } else {
      res.data.message = 'No data selected';
      res.render('error', {
        data: _objectSpread(_objectSpread({}, res.data), {}, {
          user: req.session.user
        })
      });
    }
  });
};

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
}, getPosition, getTravelType);
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

function createPDF(_x, _x2) {
  return _createPDF.apply(this, arguments);
}

function _createPDF() {
  _createPDF = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee(entry, res) {
    var templateHtml, template, loadedEntry, html, browser, page, pdf;
    return _regenerator["default"].wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            templateHtml = _fs["default"].readFileSync(_path["default"].join(process.cwd(), 'views', 'doc_template.hbs'), 'utf-8');
            template = _handlebars["default"].compile(templateHtml);
            loadedEntry = (0, _entry["default"])(entry);
            loadedEntry.granteePosition = getPositionName(entry, res.data.position);
            loadedEntry.travelLengthType = getTravelTypeName(entry, res.data.travelType);
            loadedEntry.travelDate = formatDate(loadedEntry.travelDate);
            loadedEntry.travelArrivalDate = formatDate(loadedEntry.travelArrivalDate);
            html = template(loadedEntry);
            _context.next = 10;
            return puppeteer.launch({
              args: ['--no-sandbox'],
              headless: true
            });

          case 10:
            browser = _context.sent;
            _context.next = 13;
            return browser.newPage();

          case 13:
            page = _context.sent;
            _context.next = 16;
            return page["goto"]("data:text/html;charset=UTF-8,".concat(html), {
              waitUntil: 'networkidle0'
            });

          case 16:
            _context.next = 18;
            return page.pdf();

          case 18:
            pdf = _context.sent;
            _context.next = 21;
            return browser.close();

          case 21:
            return _context.abrupt("return", pdf);

          case 22:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return _createPDF.apply(this, arguments);
}

function mergePdf() {
  return _mergePdf.apply(this, arguments);
}

function _mergePdf() {
  _mergePdf = (0, _asyncToGenerator2["default"])( /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
    var entries,
        res,
        _ret,
        _args3 = arguments;

    return _regenerator["default"].wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            entries = _args3.length > 0 && _args3[0] !== undefined ? _args3[0] : [];
            res = _args3.length > 1 ? _args3[1] : undefined;

            if (!(entries.length > 0)) {
              _context3.next = 9;
              break;
            }

            return _context3.delegateYield( /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
              var pdfsToMerge, _iterator, _step, entry, singlePdf, mergedPdf, _i, _pdfsToMerge, pdfBytes, pdf, copiedPages, buf;

              return _regenerator["default"].wrap(function _callee2$(_context2) {
                while (1) {
                  switch (_context2.prev = _context2.next) {
                    case 0:
                      pdfsToMerge = [];
                      _iterator = _createForOfIteratorHelper(entries);
                      _context2.prev = 2;

                      _iterator.s();

                    case 4:
                      if ((_step = _iterator.n()).done) {
                        _context2.next = 12;
                        break;
                      }

                      entry = _step.value;
                      _context2.next = 8;
                      return createPDF(entry, res);

                    case 8:
                      singlePdf = _context2.sent;
                      pdfsToMerge.push(singlePdf);

                    case 10:
                      _context2.next = 4;
                      break;

                    case 12:
                      _context2.next = 17;
                      break;

                    case 14:
                      _context2.prev = 14;
                      _context2.t0 = _context2["catch"](2);

                      _iterator.e(_context2.t0);

                    case 17:
                      _context2.prev = 17;

                      _iterator.f();

                      return _context2.finish(17);

                    case 20:
                      _context2.next = 22;
                      return _pdfLib.PDFDocument.create();

                    case 22:
                      mergedPdf = _context2.sent;
                      _i = 0, _pdfsToMerge = pdfsToMerge;

                    case 24:
                      if (!(_i < _pdfsToMerge.length)) {
                        _context2.next = 36;
                        break;
                      }

                      pdfBytes = _pdfsToMerge[_i];
                      _context2.next = 28;
                      return _pdfLib.PDFDocument.load(pdfBytes);

                    case 28:
                      pdf = _context2.sent;
                      _context2.next = 31;
                      return mergedPdf.copyPages(pdf, pdf.getPageIndices());

                    case 31:
                      copiedPages = _context2.sent;
                      copiedPages.forEach(function (page) {
                        mergedPdf.addPage(page);
                      });

                    case 33:
                      _i++;
                      _context2.next = 24;
                      break;

                    case 36:
                      _context2.next = 38;
                      return mergedPdf.save();

                    case 38:
                      buf = _context2.sent;
                      return _context2.abrupt("return", {
                        v: buf.buffer
                      });

                    case 40:
                    case "end":
                      return _context2.stop();
                  }
                }
              }, _callee2, null, [[2, 14, 17, 20]]);
            })(), "t0", 4);

          case 4:
            _ret = _context3.t0;

            if (!((0, _typeof2["default"])(_ret) === "object")) {
              _context3.next = 7;
              break;
            }

            return _context3.abrupt("return", _ret.v);

          case 7:
            _context3.next = 10;
            break;

          case 9:
            return _context3.abrupt("return", null);

          case 10:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));
  return _mergePdf.apply(this, arguments);
}

editRouter.get('/pdf/combined', getEntries, function (req, res) {
  // res.data.entries
  process.nextTick(function () {
    mergePdf(res.data.entries, res).then(function (merged) {
      res.set({
        'Content-Type': 'application/pdf',
        'Content-Length': merged.length,
        'Content-disposition': "inline; filename=".concat((0, _moment["default"])().format("YYYYMMDD"), "_SURAT_PERINTAH_PERJALANAN_DINAS_combined.pdf")
      });
      res.send(Buffer.from(merged, 'utf8'));
    });
  });
});
editRouter.get('/pdf/:id', function (req, res) {
  process.nextTick(function () {
    Entry.findByPk(req.params.id).then(function (entry) {
      createPDF(entry, res).then(function (pdf) {
        res.set({
          'Content-Type': 'application/pdf',
          'Content-Length': pdf.length,
          'Content-disposition': "inline; filename=".concat((0, _entry.FormatPDFName)(entry))
        });
        res.send(pdf);
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
var _default = editRouter;
exports["default"] = _default;
//# sourceMappingURL=edit.js.map