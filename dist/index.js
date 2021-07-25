"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _app = _interopRequireDefault(require("./app"));

var _helper = _interopRequireDefault(require("./helper"));

var _path = _interopRequireDefault(require("path"));

var logger = _helper["default"].logger,
    env = _helper["default"].env;

_app["default"].listen(env.PORT, function () {
  if (env.NODE_ENV.includes('dev')) {
    logger.info("app running at port: ".concat(env.PORT));
    logger.info('env vars', env);
  }
});
//# sourceMappingURL=index.js.map