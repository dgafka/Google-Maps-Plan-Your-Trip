/**
 *  Here you need to pass your authorization keys
 *  from developer account on facebook, twitter and google.
 */
module.exports = {

    'facebookAuth' : {
        'clientID' 		: '*', // your App ID
        'clientSecret' 	: '*', // your App Secret
        'callbackURL' 	: 'http://127.0.0.1:3000/auth/facebook/callback'
    },

    'twitterAuth' : {
        'consumerKey' 		: '*',
        'consumerSecret' 	: '*',
        'callbackURL' 		: 'http://127.0.0.1::3000/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID' 		: '*',
        'clientSecret' 	: '*',
        'callbackURL' 	: 'http://127.0.0.1::3000/auth/google/callback'
    }

};
