/**
 *  Here you need to pass your authorization keys
 *  from developer account on facebook, twitter and google.
 */
module.exports = {

    'facebookAuth' : {
        'clientID' 		: '*', // your App ID
        'clientSecret' 	: '*', // your App Secret
        'callbackURL' 	: 'http://localhost:3000/auth/facebook/callback'
    },

    'twitterAuth' : {
        'consumerKey' 		: '*',
        'consumerSecret' 	: '*',
        'callbackURL' 		: 'http://localhost:3000/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID' 		: '*',
        'clientSecret' 	: '*',
        'callbackURL' 	: 'http://localhost:3000/auth/google/callback'
    }

};