"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.genError = void 0;

var genError = function genError(originalError, req) {
  if (originalError == undefined || originalError == null) {
    originalError = new Error('Generic Error');
  }

  if (req != undefined) {
    originalError.url = req.originalUrl;
    originalError.method = req.method;
  }

  return originalError;
};

exports.genError = genError;
var _default = genError;
exports["default"] = _default;
//# sourceMappingURL=errorHelper.js.map