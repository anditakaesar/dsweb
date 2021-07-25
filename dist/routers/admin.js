"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _express = require("express");

var _roles = require("../helper/constants/roles");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var adminRouter = (0, _express.Router)();
adminRouter.use(function (req, res, next) {
  if (req.session.user.role === _roles.ROLES.ADMIN) {
    next();
  } else {
    res.redirect('/edit');
  }
});
adminRouter.get('/', function (req, res) {
  res.render('admin', {
    data: _objectSpread(_objectSpread({}, res.data), {}, {
      user: req.session.user
    })
  });
});
adminRouter.get('/user', function (req, res) {
  res.render('adminuser', {
    data: _objectSpread(_objectSpread({}, res.data), {}, {
      user: req.session.user
    })
  });
});
adminRouter.get('/config', function (req, res) {
  res.render('adminconfig', {
    data: _objectSpread(_objectSpread({}, res.data), {}, {
      user: req.session.user
    })
  });
});
var _default = adminRouter;
exports["default"] = _default;
//# sourceMappingURL=admin.js.map