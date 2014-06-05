module.exports = function (app, passport) {

    /**
     * Route to main page.
     */
    app.get('/', function(req, res) {
        res.render('index.ejs', { message: req.flash('message')[0], 'req': req});
    });

    /**
     * Route for rooms
     */
    app.get('/rooms', isLogged, function(req, res){
        res.render('rooms.ejs', { message: req.flash('message')[0], 'req': req});
    });

    app.post('/rooms/create', isLogged, function(req, res){
        var roomManagement = require('../modules/RoomManagement');
        var roomHelper     = new roomManagement();

        var name     = req.body.name;
        var password = req.body.password;

        roomHelper.addRoom({
            roomName: name,
            password: password,
            username: req.user.username
        }, function(results){
            var errors = (typeof results.errorList !== "undefined" && results.errorList.length > 0) ? results : false;
            if(!errors) {
                errors = {
                    errorList : ['Room has been created.'],
                    type      : 'success',
                    room      : results
                };
            }

            return res.json(JSON.stringify(errors));
        });
    });

    app.get('/rooms/:id', isLogged, function(req, res){
        var id = req.params.id;

        res.render('googleRoom.ejs', { message: req.flash('message')[0], 'req': req, id: id});
    });

    /**
     * Route to register form
     */
    app.get('/signup', isLoggedOff, function(req, res){
        res.render('signup.ejs', { message: req.flash('message')[0], 'req': req});
    });

    /**
     * Route for register submit
     */
   app.post('/signup', function(req, res){
       var email    = req.body.email;
       var password = req.body.password;
       var username = req.body.username;

       var userManager     = require('../modules/UserManagement');
       var userCtlInstance = new userManager();

       userCtlInstance.addUser({email: email, username: username, password: password}, function(errors){
           if(errors.type == 'danger') {
               return res.render('signup', {message: errors, 'req': req});
           }
           req.flash('message', errors);
           return res.redirect('/');
       });
   });

    /**
     * Route for login form
     */
    app.get('/login', isLoggedOff, function(req, res){
        res.render('login.ejs', {message: req.flash('message')[0], 'req': req});
    });

    /**
     * Route for login submit
     */
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/',       /** redirect to main page with session on */
        failureRedirect : '/login', /** redirect to sign up, if fails         */
        failureFlash : true          /** allow flash messages                  */
    }));


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
     * Destroy user session
     */
    app.get('/logout', function(req, res){
        req.logout();
        res.redirect('/');
    });

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