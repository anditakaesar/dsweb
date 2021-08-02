"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

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

var _errorHelper = _interopRequireDefault(require("./helper/errorHelper"));

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
  err = (0, _errorHelper["default"])(err, req);

  _helper["default"].logger.error(err.message, err);

  res.status(500).json({
    message: 'Some error, please contact your developer',
    error: error
  });
});
var _default = app;
exports["default"] = _default;
//# sourceMappingURL=app.js.map