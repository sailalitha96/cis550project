var passport = require('passport');
var dotenv = require('dotenv');
var util = require('util');
var url = require('url');
var querystring = require('querystring');
var MongoClient = require('mongodb').MongoClient;

dotenv.config();

exports.loginAuth = passport.authenticate('auth0', {scope: 'openid email profile'});
exports.loginRedirect = function (req, res) {res.redirect('/');};

exports.callback = function (req, res, next) {
    passport.authenticate('auth0', function (err, user, info) {
      if (err) { return next(err); }
      if (!user) { return res.redirect('/login'); }
      req.logIn(user, function (err) {
        if (err) { return next(err); }
        var returnTo = req.session.returnTo;
        delete req.session.returnTo;
        res.redirect(returnTo || '/home');
      });
    })(req, res, next);
  };

exports.logOut = function(req, res){
    req.logout();
    
    var returnTo = req.protocol + '://' + req.hostname;
    var port = req.connection.localPort;
    if (port !== undefined && port !== 80 && port !== 443) {
      returnTo += ':' + port;
    }
    var logoutURL = new url.URL(
      util.format('https://%s/v2/logout', process.env.AUTH0_DOMAIN)
    );
    console.log("LogoutUrl:"+returnTo);
    var searchString = querystring.stringify({
      client_id: process.env.AUTH0_CLIENT_ID,
      returnTo: returnTo
    });
    logoutURL.search = searchString;
  
    res.redirect(logoutURL);
};
  
exports.secured = function (req, res, next) {
      if (req.user) { return next(); }
      // console.log(req.session);
      req.session.returnTo = req.originalUrl;
      res.redirect('/login');
};

// use monggo db 
exports.userInfo = function(req,res,next){
  console.log("In auth 0");
  console.log(req.user);
  MongoClient.connect("mongodb://localhost:27017", function (err, client) {
    var db = client.db('Userinformation');
    db.collection('login_Information', function (err, collection) {
        var newDate = new Date();
        var tme = newDate.toLocaleTimeString();
        tme = tme.concat(req.user.emails[0]['value'])
        // var datetime = newDate.timeNow();
        collection.insertOne({ user_loginsuccess: req.user.email_verified,user_iden: tme,user_name:req.user.nickname , user_emailid: req.user.emails[0]['value'] , user_id: req.user.user_id});

    });
  })
  // create a mongo client and load your user data in it 
  res.json(req.user);
};