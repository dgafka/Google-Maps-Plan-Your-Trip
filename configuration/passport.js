// =========================================================================
// passport session setup ==================================================
// =========================================================================
// required for persistent login sessions
// passport needs ability to serialize and unserialize users out of session



var LocalStrategy    = require('passport-local').Strategy;       /** Local Strategy go for passport docs, if need more informations */
var userManagment    = require('../modules/UserManagement');      /** Manager class for users.                                       */
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy  = require('passport-twitter').Strategy;
var GoogleStrategy   = require('passport-google-oauth').OAuth2Strategy;

var config           = require('../configuration/auth');

module.exports = function(passport) {

    /**      used to serialize the user             */
    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    /**      used to deserialize the user           */
    passport.deserializeUser(function(obj, done) {
        done(null, obj);
    });

    /**
     * Local login strategy for for logging user.
     */
    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'email',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass back the entire request to the callback
    }, function(req, email, password, done){

        process.nextTick(function() {

            var userManager = new userManagment();
            userManager.authenticateUserByEmailPassoword(email, password, function(user){
                if(user.errorList){
                    return done(null, false, req.flash('message', user))
                }

                req.flash('message', {
                    errorList : ['Logged successfully.'],
                    type      : 'success'
                });
                return done(null, user);
            })

        })
    }))

    /**
     * Facebook strategy for logging via facebook
     */
    passport.use(new FacebookStrategy({
            clientID: config.facebookAuth.clientID,
            clientSecret: config.facebookAuth.clientSecret,
            callbackURL: config.facebookAuth.callbackURL,
            scope: ['email']
        },
        function(accessToken, refreshToken, profile, done) {
            process.nextTick(function() {
                var email       = (typeof profile.emails === "undefined") ? profile.displayName : profile.emails[0].value;
                var token       = accessToken;
                var username    = profile.displayName;
                var facebookId  = profile.id;
                var password    = profile.id + (Math.random() * 2000);

                var user        = require('../models/User');;

                user.findOne({'facebook.facebookId' : facebookId}, function(err, userResults){
                    if(err) {
                        return console.error(err);
                    }

                    if(userResults) {
                        return done(null, userResults);
                    }

                    var userModel      = new user();
                    userModel.password            = userModel.generateHash(password);
                    userModel.email               = email;
                    userModel.username            = username;
                    userModel.facebook.token      = token;
                    userModel.facebook.facebookId = facebookId;

                    userModel.save();

                    done(null, userModel);
                })
            })
        }
    ));


    /**
     * Google strategy for logging via google
     */
    passport.use(new GoogleStrategy({

            clientID        : config.googleAuth.clientID,
            clientSecret    : config.googleAuth.clientSecret,
            callbackURL     : config.googleAuth.callbackURL,
            scope: ['https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile']

        },
        function(token, refreshToken, profile, done) {

            process.nextTick(function() {
                var email       = profile.emails[0].value;
                var token       = token;
                var username    = profile.displayName;
                var googleId    = profile.id;
                var password    = profile.id + (Math.random() * 2000);

                var user        = require('../models/User');;

                user.findOne({'google.googleId' : googleId}, function(err, userResults){
                    if(err) {
                        return console.error(err);
                    }

                    if(userResults) {
                        return done(null, userResults);
                    }

                    var userModel      = new user();
                    userModel.password        = userModel.generateHash(password);
                    userModel.email           = email;
                    userModel.username        = username;
                    userModel.google.token    = token;
                    userModel.google.googleId = googleId;

                    userModel.save();

                    done(null, userModel);
                })
            })
        }
    ));


    /**
     * Twitter strategy for logging via twitter
     */
    passport.use(new TwitterStrategy({

            consumerKey     : config.twitterAuth.consumerKey,
            consumerSecret  : config.twitterAuth.consumerSecret,
            callbackURL     : config.twitterAuth.callbackURL

        },
        function(token, tokenSecret, profile, done) {

            console.log(profile);
            process.nextTick(function() {
                /** Twitter doesn't provide email address */
                var email       = profile.displayName;
                var token       = token;
                var username    = profile.displayName;
                var twitterId   = profile.id;
                var password    = profile.id + (Math.random() * 2000);

                var user        = require('../models/User');;

                user.findOne({'twitter.twitterId' : twitterId}, function(err, userResults){
                    if(err) {
                        return console.error(err);
                    }

                    if(userResults) {
                        return done(null, userResults);
                    }

                    var userModel      = new user();
                    userModel.password          = userModel.generateHash(password);
                    userModel.email             = email;
                    userModel.username          = username;
                    userModel.twitter.token     = token;
                    userModel.twitter.twitterId = twitterId;

                    userModel.save();

                    done(null, userModel);
                })
            })

        })
    );

};