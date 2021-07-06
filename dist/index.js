"use strict";

require("dotenv/config");

var _app = _interopRequireDefault(require("./app"));

var _helper = _interopRequireDefault(require("./helper"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var logger = _helper["default"].logger,
    env = _helper["default"].env;

_app["default"].listen(env.PORT, function () {
  if (env.NODE_ENV.includes('dev')) {
    logger.info("app running at port: ".concat(env.PORT));
    logger.info('env vars', env);
  }
});
//# sourceMappingURL=index.js.map