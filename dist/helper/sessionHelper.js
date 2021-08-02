"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validatePassword = exports.checkSessionApi = exports.checkSession = void 0;

var _bcrypt = _interopRequireDefault(require("bcrypt"));

var _errorHelper = _interopRequireDefault(require("./errorHelper"));

var checkSession = function checkSession(req, res, next) {
  if (req.session.user === undefined) {
    res.message = 'You must login';
    res.redirect('/auth/login');
  } else {
    next();
  }
};

exports.checkSession = checkSession;

var checkSessionApi = function checkSessionApi(req, res, next) {
  if (req.session.user === undefined) {
    var error = (0, _errorHelper["default"])(null, req);
    error.message = 'You Must Login';
    next(error);
  } else {
    next();
  }
};

exports.checkSessionApi = checkSessionApi;

var validatePassword = function validatePassword(pass, hash) {
  return _bcrypt["default"].compareSync(pass, hash);
};

exports.validatePassword = validatePassword;
//# sourceMappingURL=sessionHelper.js.map