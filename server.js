#!/bin/env node
var server_port = process.env.OPENSHIFT_NODEJS_PORT || 3000
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'

/*Dependencies*/
var express = require('express'),
    passport = require('passport'),
    util = require('util'),
    GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    session = require('express-session'),
    mongoose = require('mongoose'),
    LocalStrategy = require('passport-local').Strategy,
    multer  = require('multer'),
    routes = require('./routes');

/*ENV settings*/
var connection_string = '127.0.0.1:27017/nodejs';
// if OPENSHIFT env variables are present, use the available connection info:
if(process.env.OPENSHIFT_MONGODB_DB_PASSWORD){
  connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":" +
  process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" +
  process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
  process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
  process.env.OPENSHIFT_APP_NAME;
}

mongoose.connect("mongodb://"+connection_string);//try connction to database
//see what was result
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("connction established to db");
  });

var app = express();

//=========== Configure Express ===========//
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride());
app.use(logger('dev'));
app.use(session({ secret: 'keyboard cat',  saveUninitialized: true, resave: true}));
//passport setup
app.use(passport.initialize());
app.use(passport.session());
// route to static html files
app.use(express.static(__dirname + '/public'));

//import auth variables
require('./routes/auth.js').auth(passport);


//=========== EJS routes ===========//

app.get('/login', function(req, res){
  res.render('login', {message:req.auth_msg});
});

app.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/userinfo.email'] }),
  function(req, res){
    // The request will be redirected to Google for authentication, so this
    // function will not be called.
  });

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/profile');
  });

app.post('/localauth', passport.authenticate('login', {
  successRedirect : '/profile',
  failureRedirect : '/login',
}));

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.get('/profile',ensureAuthenticated,function(req,res){
  res.render('profile', req.user)
})

/* ==== Tutorial Routes ====*/
app.get('/tutorial/getJournal',routes.getJournal);
app.get('/tutorial/getPageById',routes.getPageById);
app.get('/tutorial/getViews',routes.getViews);
app.get('/tutorial/findPageByTagName',routes.findPageByTagName);
app.get('/tutorial/searchAllPages',routes.searchAllPages);
app.post('/tutorial/newpage',routes.savePage);
app.get('/tutorial/getUser', ensureAuthenticated, function(req, res){
  res.send(JSON.stringify(req.user));
})
app.get('/tutorial/imageUpload',routes.getImageForm);
app.post('/tutorial/imageUpload',
  multer({dest:'public/usr/temp/'}).single('upload'),
  routes.getPostImageData);

//=========== Express Form Data routes ===========//
app.get('/data/get', routes.getData);
app.get('/data/getbyid', routes.getDataById);
app.post('/data/newfile/', 
  multer({dest:'public/usr/temp/'}).single('upload'),routes.uploadFile);

app.post('/data/insert', 
  multer({dest:'public/usr/temp/'}).single('upload'), routes.InsertData);

app.post('/data/replace', 
  multer({dest:'public/usr/temp/'}).single('upload'), routes.ReplaceData);

app.post('/data/delete',routes.deleteData);

app.post('/changePassword',ensureAuthenticated, routes.changePass);

//mongodb through middleware
app.use("/", ensureAdmin, require("./mongodb/app.js"));  

//Handle 500
app.use(function(error, req, res, next) {
res.status(500).send('500: Internal Server Error');
});


var server = app.listen(server_port,server_ip_address, function () {
    console.log("listening on "+server_ip_address+":"+server_port);
});

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed.  Otherwise, the user will be redirected to the
//   login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login');
}

function ensureActive(req, res, next) {
  if (req.user.IsActivated) { return next(); }
  res.redirect('/login');
}

function ensureAdmin(req, res, next) {
  if (req.isAuthenticated()) { 
   if (req.user.IsActivated) { return next(); }
  }
  res.redirect('/login');
}
