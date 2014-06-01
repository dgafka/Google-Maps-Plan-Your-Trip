// =========================================================================
// passport session setup ==================================================
// =========================================================================
// required for persistent login sessions
// passport needs ability to serialize and unserialize users out of session



var LocalStrategy   = require('passport-local').Strategy;       /** Local Strategy go for passport docs, if need more informations */
var userManagment   = require('../modules/UserManagment');      /** Manager class for users.                                       */

module.exports = function(passport) {

    /**      used to serialize the user             */
    passport.serializeUser(function(user, done) {
        done(null, user);
    });

    /**      used to deserialize the user           */
    passport.deserializeUser(function(obj, done) {
        done(null, obj);
    });

    /** Local-signup is strategy for registration new user */
    passport.use('local-signup', new LocalStrategy({
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'email',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },
        function(req, email, password, done) {

            process.nextTick(function() {

                var userManager = new userManagment();

                userManager.addUser({email: email, password: password}, function(user){
                    if(user.errorList){
                        return done(null, false, req.flash('message', user))
                    }

                    req.flash('message', {
                        errorList : ['Registered successfully.'],
                        type      : 'success'
                    });
                    return done(null, user);
                })

            });

        }));

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

};