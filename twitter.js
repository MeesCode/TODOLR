//sessions
var cookies = require("cookie-parser");
var passport = require("passport");
var Strategy = require("passport-twitter").Strategy;

//Authentication with passport
passport.serializeUser(function(user, done){
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

passport.use(new Strategy({
    consumerKey: "2aPfaZmMq7aUh0CaZYtcFrLnl",
    consumerSecret: "mSJI4XtcBebhVjrEzhccLapD9d4ymsXSmZCNAF7RS44P0Qo9LR",
    callbackURL: 'http://127.0.0.1:8080/test-login'
  },
  function(token, tokenSecret, profile, done) {
    return done(null, profile);
  }
));
