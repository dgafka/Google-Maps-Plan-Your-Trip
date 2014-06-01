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
   app.post('/signup', passport.authenticate('local-signup', {
       successRedirect : '/',       /** redirect to main page with session on */
       failureRedirect : '/signup', /** redirect to sign up, if fails         */
       failureFlash : true          /** allow flash messages                  */
    }))

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

    app.get('/logout', function(req, res){
        req.logout();
        res.redirect('/');
    })

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