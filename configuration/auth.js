/**
 *  Here you need to pass your authorization keys
 *  from developer account on facebook, twitter and google.
 */
module.exports = {

    'facebookAuth' : {
        'clientID' 		: '317621851722391', // your App ID
        'clientSecret' 	: '7a3a94d090d099e17eeb5f4322275cb0', // your App Secret
        'callbackURL' 	: 'http://localhost:3000/auth/facebook/callback'
    },

    'twitterAuth' : {
        'consumerKey' 		: '3bLFV24YVVBXwr00X5GaFba6Y',
        'consumerSecret' 	: 'lqtsXx14e39oSy69kwvsiHTsj9obMVYbo5HOtMn5Xwa6j2gZku',
        'callbackURL' 		: 'http://localhost:3000/auth/twitter/callback'
    },

    'googleAuth' : {
        'clientID' 		: '408946951273-jr8ccdg2vcorbkgkfc1takjeimar09a5.apps.googleusercontent.com',
        'clientSecret' 	: 'Uacdd2vLJE4LZBM2-05SEdb3',
        'callbackURL' 	: 'http://localhost:3000/auth/google/callback'
    }

};