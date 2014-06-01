module.exports = function (app, passport) {

    /**
     * Route to main page.
     */
    app.get('/', function(req, res) {
        var email = '';
        if(req.user) {
            email = req.user.email;
        }
        res.render('index.ejs', { message: req.flash('message')[0], email: email});
    })

    /**
     * Route to register form
     */
    app.get('/signup', isLoggedOff, function(req, res){
        res.render('signup.ejs', { message: req.flash('message')[0]});
    })

    /**
     * Route for register submit
     */
   app.post('/signup', function(req, res){
       var email    = req.body.email;
       var password = req.body.password;
       var username = req.body.username;

       var userManager     = require('../modules/UserManagment');
       var userCtlInstance = new userManager();

       userCtlInstance.addUser({email: email, username: username, password: password}, function(errors){
           if(errors.type == 'danger') {
               return res.render('signup', {message: errors});
           }
           req.flash('message', errors);
           return res.redirect('/');
       })
   })

    /**
     * Route for login form
     */
    app.get('/login', isLoggedOff, function(req, res){
        res.render('login.ejs', {message: req.flash('message')[0]})
    })

    /**
     * Route for login submit
     */
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/',       /** redirect to main page with session on */
        failureRedirect : '/login', /** redirect to sign up, if fails         */
        failureFlash : true          /** allow flash messages                  */
    }))

    /**
     * Destroy user session
     */
    app.get('/logout', function(req, res){
        req.logout();
        res.redirect('/');
    })


    /**
     * Route for facebook authorization
     */
    app.get('/auth/facebook', passport.authenticate('facebook'));

    /**
     * Route for facebook return callback
     */
    app.get('/auth/facebook/callback',
        passport.authenticate('facebook', {
            successRedirect: '/',
            failureRedirect: '/',
            failureFlash : true
        }));


    /**
     * Twitter authentication
     */
    app.get('/auth/twitter', passport.authenticate('twitter'));

    /**
     * Twitter callback
     */
    app.get('/auth/twitter/callback',
        passport.authenticate('twitter', {
            successRedirect : '/',
            failureRedirect : '/'
        })
    );


    /**
     * Authenticate via google
     */
    app.get('/auth/google', passport.authenticate('google'));

    /**
     * Google callback with user data
     */
    app.get('/auth/google/callback',
        passport.authenticate('google', {
            successRedirect : '/',
            failureRedirect : '/'
        })
    );



    /**
     * Checks if user is logged in
     * @param req
     * @param res
     * @param next
     * @returns {*}
     */
    function isLogged(req, res, next) {

        if(req.isAuthenticated()) {
            return next();
        }

        res.redirect('/login');
    }

    /**
     * Checks if user is logged in
     * @param req
     * @param res
     * @param next
     * @returns {*}
     */
    function isLoggedOff(req, res, next){

        if(!req.isAuthenticated()) {
            return next();
        }

        res.redirect('/');
    }
};