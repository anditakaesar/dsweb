"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var _db = _interopRequireDefault(require("../helper/db"));

var _helper = _interopRequireDefault(require("../helper"));

var _roles = require("../helper/constants/roles");

var _bcrypt = _interopRequireDefault(require("bcrypt"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var userRouter = (0, _express.Router)();
var User = _db["default"].User;

function FormatUser(user) {
  var newUser = {};
  newUser.id = user.id;
  newUser.role = user.role;
  newUser.username = user.username;
  return newUser;
}

userRouter.get('/all', function (req, res) {
  process.nextTick(function () {
    User.findAndCountAll({
      where: {
        role: _roles.ROLES.STAFF
      }
    }).then(function (results) {
      var data = [];
      results.rows.forEach(function (user, i) {
        data.push(FormatUser(user));
      });
      res.json({
        message: 'all users loaded',
        data: data,
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
userRouter.get('/:id', function (req, res) {
  process.nextTick(function () {
    User.findOne({
      where: {
        id: req.params.id
      }
    }).then(function (result) {
      res.json({
        message: 'user loaded',
        user: FormatUser(result)
      });
    })["catch"](function (err) {
      res.json({
        message: 'error',
        errmsg: err.message
      });
    });
  });
});
userRouter.post('/:id', function (req, res) {
  process.nextTick(function () {
    User.findOne({
      where: {
        id: req.params.id
      }
    }).then(function (user) {
      // update
      if (req.body.password != req.body.passwordConfirm) {
        throw new Error('Password and Confirm Password must be same!');
      }

      if (user) {
        var hasPass = _bcrypt["default"].hashSync(req.body.password, _helper["default"].env.SALT_HASH);

        user.update({
          username: req.body.username,
          password: hasPass
        });
      }

      res.json({
        message: 'POST INVOKED',
        user: user,
        request: req.body
      });
    })["catch"](function (err) {
      res.json({
        message: 'error',
        errmsg: err.message
      });
    });
  });
});
var _default = userRouter;
exports["default"] = _default;
//# sourceMappingURL=user.js.map