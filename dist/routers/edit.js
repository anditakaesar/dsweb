"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _roles = require("../helper/constants/roles");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var editRouter = (0, _express.Router)();
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
var _default = editRouter;
exports["default"] = _default;
//# sourceMappingURL=edit.js.map