"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _express = _interopRequireDefault(require("express"));

var _bodyParser = require("body-parser");

var _compression = _interopRequireDefault(require("compression"));

var _path = _interopRequireDefault(require("path"));

var _expressSession = _interopRequireDefault(require("express-session"));

var _cookieParser = _interopRequireDefault(require("cookie-parser"));

var _helmet = _interopRequireDefault(require("helmet"));

var _helper = _interopRequireDefault(require("./helper"));

var _sessionHelper = require("./helper/sessionHelper");

var _alert = require("./helper/css/alert");

var _auth = require("./routers/auth");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) { symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); } keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { (0, _defineProperty2["default"])(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

var routers = _helper["default"].routers,
    env = _helper["default"].env,
    sessionStorage = _helper["default"].sessionStorage;
var _helper$configs = _helper["default"].configs,
    hbs = _helper$configs.hbs,
    sessionCookieConfig = _helper$configs.sessionCookieConfig;
var app = (0, _express["default"])(); // middlewares

app.use((0, _bodyParser.json)());
app.use((0, _bodyParser.urlencoded)({
  extended: true
}));
app.use((0, _compression["default"])());
app.use((0, _helmet["default"])({
  contentSecurityPolicy: false
})); //session

sessionStorage.sync();
app.use((0, _expressSession["default"])({
  name: env.SESSION_NAME,
  secret: env.COOKIES_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: sessionCookieConfig,
  store: sessionStorage
}));
app.use((0, _cookieParser["default"])(env.COOKIES_SECRET)); // static files

app.use(_express["default"]["static"](_path["default"].join(__dirname, '../static'))); //view engine

app.set('views', _path["default"].join(__dirname, '../views'));
app.set('view engine', 'hbs');
app.engine('hbs', hbs.engine); // global routers

app.use(function (req, res, next) {
  res.data = {};
  res.data.title = 'DS Web';
  res.data.error = new Error(); // res.data.error = {
  //   message: 'error test',
  //   meta: {
  //     field1: 'some meta here',
  //   },
  // }

  res.data.message_type = _alert.ALERT.PRIMARY;
  next();
});
app.use('/api', _sessionHelper.checkSessionApi, routers.api);
app.use('/admin', _sessionHelper.checkSession, routers.routerAdmin);
app.use('/edit', _sessionHelper.checkSession, routers.editRouter);
app.use('/auth', routers.routerAuth);
app.use('/migration', routers.migrationRouter);
app.get('/', _auth.loginRoute); // error handling

app.use(function (err, req, res, next) {
  var error = res.data.error;
  error.meta = _objectSpread(_objectSpread({}, error.meta), {}, {
    method: req.method,
    originalUrl: req.originalUrl
  });

  _helper["default"].logger.error(error.message, error.meta);

  res.status(500).json({
    message: 'Some error, please contact your developer',
    error: error
  });
});
var _default = app;
exports["default"] = _default;
//# sourceMappingURL=app.js.map