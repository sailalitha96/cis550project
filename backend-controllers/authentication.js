var passport = require('passport');
var dotenv = require('dotenv');
var util = require('util');
var url = require('url');
var querystring = require('querystring');

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
      req.session.returnTo = req.originalUrl;
      res.redirect('/login');
};


exports.userInfo = function(req,res,next){
  res.json(req.user);
};