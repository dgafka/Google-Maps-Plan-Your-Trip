module.exports = function (app, passport) {

    /**
     * Route to main page.
     */
    app.get('/', function(req, res) {
        var email = '';
        if(req.user) {
            email = req.user.email;
        }
        res.render('index.ejs', { message: req.flash('message')});
    })


};