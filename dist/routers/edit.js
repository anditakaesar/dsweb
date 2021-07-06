"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = require("express");

var editRouter = (0, _express.Router)();
editRouter.get('/', function (req, res) {
  res.render('edit', res.data);
});
var _default = editRouter;
exports["default"] = _default;
//# sourceMappingURL=edit.js.map