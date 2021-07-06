"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.loginRoute = void 0;

var _express = require("express");

var _logger = _interopRequireDefault(require("../logger"));

var _db = _interopRequireDefault(require("../helper/db"));

var _alert = require("../helper/css/alert");

var _sessionHelper = require("../helper/sessionHelper");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var User = _db["default"].User;
var messages = {
  LOGIN: 'Please login',
  WRONGUSERPASS: 'User not found or wrong password',
  FILL: 'Please fill the username and password',
  LOGOUT: 'You have been logged out'
};
var routerAuth = (0, _express.Router)();

var fieldCheck = function fieldCheck(req, res, next) {
  if (!req.body.username || !req.body.password) {
    res.data.message_type = _alert.ALERT.WARNING;
    res.render('login', {
      data: _objectSpread(_objectSpread({}, res.data), {}, {
        message: messages.FILL
      })
    });
  } else {
    next();
  }
};

var loginRoute = function loginRoute(req, res, next) {
  if (req.session.user === undefined) {
    res.data.message_type = _alert.ALERT.WARNING;
    res.render('login', {
      data: _objectSpread(_objectSpread({}, res.data), {}, {
        message: messages.LOGIN
      })
    });
  } else {
    res.redirect('/admin');
  }
};

exports.loginRoute = loginRoute;
routerAuth.get('/login', loginRoute);
routerAuth.post('/login', fieldCheck, function (req, res, next) {
  process.nextTick(function () {
    User.findOne({
      where: {
        username: req.body.username
      }
    }).then(function (user) {
      if (user) {
        if ((0, _sessionHelper.validatePassword)(req.body.password, user.password)) {
          req.session.user = {
            authenticated: true,
            username: user.username,
            role: user.role
          };
          res.redirect('/admin');
        } else {
          res.data.message_type = _alert.ALERT.DANGER;
          res.render('login', {
            data: _objectSpread(_objectSpread({}, res.data), {}, {
              message: messages.WRONGUSERPASS
            })
          });
        }
      } else {
        res.data.message_type = _alert.ALERT.DANGER;
        res.render('login', {
          data: _objectSpread(_objectSpread({}, res.data), {}, {
            message: messages.WRONGUSERPASS
          })
        });
      }
    })["catch"](function (err) {
      res.data.error.message = err.message;
      next(res.data.error);
    });
  });
});
routerAuth.get('/logout', function (req, res) {
  req.session.destroy();
  res.render('logout', {
    data: _objectSpread(_objectSpread({}, res.data), {}, {
      message: messages.LOGOUT
    })
  });
});
var _default = routerAuth;
exports["default"] = _default;
//# sourceMappingURL=auth.js.map