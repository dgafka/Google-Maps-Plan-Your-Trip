var mongoose            = require('mongoose');
var bcrypt              = require('bcrypt-nodejs');


var userSchema          = mongoose.Schema({
    email    : String,
    password : String,
    username : String,
    google   : {
        token       : String,
        googleId    : String
    },
    facebook: {
        token       : String,
        facebookId  : String
    },
    twitter:  {
        token       : String,
        twitterId   : String
    }
})

/** generating a hash */
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

/** checking if password is valid */
userSchema.methods.validPassword = function(passwordSource, passwordTypedByUser) {
    return bcrypt.compareSync(passwordTypedByUser, passwordSource);
}

module.exports = mongoose.model('User', userSchema);