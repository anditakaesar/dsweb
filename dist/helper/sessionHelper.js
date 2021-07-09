"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validatePassword = exports.checkSessionApi = exports.checkSession = void 0;

var _bcrypt = _interopRequireDefault(require("bcrypt"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

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
    res.data.error = {
      message: 'You must login',
      meta: {
        intmsg: 'accessing checkSessionApi'
      }
    };
    next(res.data.error);
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