//*******************************
//
// Socket.io authorization access to connect to the server via websockets
//
//*******************************

var onAuthorizeSuccess = function (data, accept) {
    console.log('Authorized access to socket.io');
    accept(null, true);
};

var onAuthorizeFail = function (data, message, error, accept) {
    if (error) {
        throw new Error(message);
    }
    console.log('Unauthorized access to socket.io:', message);
    accept(null, false);
};

module.exports = function(io, express, passport, option) {
    var passportSocketIo = require('passport.socketio');

    io.set('authorization', passportSocketIo.authorize({
        passport: passport,
        cookieParser: express.cookieParser,
        key: option.sessionKey,
        secret: option.sessionSecret,
        store: option.sessionStore,
        success: onAuthorizeSuccess,
        fail: onAuthorizeFail
    }));

};