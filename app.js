var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const User = require('./models/user');
var logger = require('morgan');
const authMiddleware = require('./middleware/auth');

const adminRouter = require('./routes/admin');
const skillsRouter = require('./routes/skills');
const usersRouter = require('./routes/users');

var app = express();

// MongoDB connection
mongoose.connect('mongodb://localhost/skills', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Successfully connected to MongoDB.');
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
  process.exit(1);
});

app.use(session({
  secret: 'jskfksjhfany67',
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
      mongoUrl: 'mongodb://localhost/skills',
      ttl: 24 * 60 * 60 // 1 day
  })
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to pass the session to the views
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

app.get('/', authMiddleware.isAuthenticated, async (req, res, next) => {
  res.redirect('/skills');
});

app.get('/api/user', (req, res) => {
  const user = req.session.user;
  res.json({
      username: user?.username || null,
      admin: user?.admin || false
  })
});

app.use('/admin', adminRouter);
app.use('/skills', skillsRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
