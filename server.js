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
    LocalStrategy = require('passport-local').Strategy;

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
require('./handles/auth.js')(passport);

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

app.get('/admin/alumni/',ensureAuthenticated,ensureActive, function(req,res){
  res.render('alumni', { user: req.user.name })
})
app.get('/admin/alumniMod/',ensureAuthenticated,ensureActive,function(req,res){
  res.render('alumniMod', { user: req.user.name })
})
app.get('/admin/announcements/',ensureAuthenticated,ensureActive,function(req,res){
  res.render('announcements', { user: req.user.name })
})
app.get('/admin/linkGenerator/',ensureAuthenticated,ensureActive,function(req,res){
  res.render('linkGenerator', { user: req.user.name })
})
app.get('/admin/people/',ensureAuthenticated,ensureActive,function(req,res){
  res.render('people', { user: req.user.name })
})
app.get('/admin/peopleMod/',ensureAuthenticated,ensureActive,function(req,res){
  res.render('peopleMod', { user: req.user.name })
})
app.get('/admin/upload/',ensureAuthenticated,ensureActive,function(req,res){
  res.render('upload', { user: req.user.name })
})

app.get('/profile',ensureAuthenticated,function(req,res){
  res.render('profile', req.user)
})

app.get('/tutorial/getJournal',require('./handles/tutorial.js').getJournal);
app.get('/tutorial/getPageById',require('./handles/tutorial.js').getPageById);
app.get('/tutorial/getViews',require('./handles/tutorial.js').getViews);
app.get('/tutorial/findPageByTagName',require('./handles/tutorial.js').findPageByTagName);
app.post('/tutorial/newpage',require('./handles/tutorial.js').savePage);
app.get('/tutorial/getUser', ensureAuthenticated, function(req, res){
  res.send(JSON.stringify(req.user));
})
//=========== Express File Handle routes ===========//
app.post('/inbound/newImage',function(req,res){
  res.send('Not Supported, use url')});
app.post('/inbound/newpage', require('./handles/newpage.js'));
app.post('/inbound/update', require('./handles/updateJSON.js'));
app.post('/inbound/newfile', require('./handles/newfile.js'));
app.post('/inbound/modify', require('./handles/modifyJSON.js'));
app.post('/changePassword',ensureAuthenticated, require('./handles/db_routines.js').changePass);
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
