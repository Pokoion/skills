var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
var logger = require('morgan');
const bodyParser = require('body-parser');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
require('dotenv').config();

const authMiddleware = require('./middleware/auth');
const adminRouter = require('./routes/admin');
const skillsRouter = require('./routes/skills');
const usersRouter = require('./routes/users');
const getSkillNumbers = require('./middleware/skillsNumber');
const messageMiddleware = require('./middleware/Messages');
const userService = require('./services/user.service');
const userSkillService = require('../services/userSkill.service');

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

app.use(passport.initialize());
app.use(passport.session());

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/google/callback",
  passReqToCallback: true
}, async (req, accessToken, refreshToken, profile, done) => {
  try {
    const username = profile.displayName;
    let user = await userService.findUserByUsername(username);

    if (!user) {
      user = await userService.createUser(username);
    }
    req.session.user = user;
    return done(null, user);
  } catch (err) {
    done(err);
  }
}));

passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: "http://localhost:3000/auth/github/callback",
  passReqToCallback: true
}, async (req, accessToken, refreshToken, profile, done) => {
  try {
    const username = profile.username || profile.displayName;
    let user = await userService.findUserByUsername(username);

    if (!user) {
      user = await userService.createUser(username, null);
    }

    req.session.user = user;
    done(null, user);
  } catch (err) {
    done(err);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.username);
});

passport.deserializeUser(async (username, done) => {
  try {
    const user = await userService.findUserByUsername(username);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/users/login' }),
  (req, res) => {
    req.session.success_msg = 'You are now logged in with Google';
    req.session.user = req.user;
    res.redirect('/skills/electronics'); 
});

app.get('/auth/github', passport.authenticate('github', { scope: ['user:email'] }));

app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/users/login' }),
  (req, res) => {
    req.session.success_msg = 'You are now logged in with GitHub!';
    req.session.user = req.user;
    res.redirect('/skills/electronics');
  }
);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware to pass the session to the views
app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

// Middleware to get the number of skills in a tree
app.use(getSkillNumbers);

// Middleware to handle messages
app.use(messageMiddleware);

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

app.get('/user-skill/:skillId', async (req,res,next)=>{
  try{
  const skillId = req.params.skillId;
  const userId= req.session.user._id;

  const userSkill = userSkillService.getUserSkillBySkillAndUser(skillId,userId);

  if(userSkill){
    res.json(userSkill);
  }
  else{
    res.status(404).send('UserSkill not found');
  }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener el UserSkill' });
  }
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
