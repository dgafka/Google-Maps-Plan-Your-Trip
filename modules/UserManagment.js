module.exports = function() {

    this.userSchema = require('../models/User');

    /**
     * Add user to database
     * @param options
     * @param callback
     */
    this.addUser = function(options, callback){
        var errors = {
            errorList : [],
            type      : 'danger'
        };
        var user   = new this.userSchema();

        if(options.email.length < 3 && !this.emailValidation(options.email)) {
            errors.errorList.push('Email is wrong.')
        }
        if(options.password.length < 6) {
            errors.errorList.push('Password is to short, it should contains atleast 6 letters.');
        }

        if(errors.errorList.length > 0) {
            callback(errors);
            return;
        }

        this.userSchema.findOne({email : options.email}, function(err, userSearch){
            if(err){
                return console.error(err);
            }

            if(userSearch){
                errors.errorList.push('Email already taken.');
                callback(errors);
                return;
            }

            user.email    = options.email;
            user.password = user.generateHash(options.password);

            user.save(function(err){
                if(err){
                    return console.error(err);
                }

                callback(user);
            });
        })
    }

    /**
     * Find user by email and password
     * @param email
     * @param password
     */
    this.authenticateUserByEmailPassoword = function(email, password, callback){

        var errors = {
            errorList : [],
            type      : 'danger'
        };
        var user   = new this.userSchema();
        this.userSchema.findOne({email: email}, function(err, userResult){
            if(err){
                return console.error(err);
            }

            if(!(userResult)){
                errors.errorList.push('Following user doesn\'t not exist.');
                callback(errors);
                return;
            }

            if(user.validPassword(userResult.password, password)) {
                callback(userResult);
                return;
            }

            errors.errorList.push('Wrong password.');
            callback(errors);
        })

    }


    this.emailValidation = function validateEmail(email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

}