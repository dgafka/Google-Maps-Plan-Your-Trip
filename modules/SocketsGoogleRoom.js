var ejs = require('ejs');
var fs  = require('fs');
var googleRooms = [];

//this.ioSockets.manager.roomClients[socket.id] awesome get all rooms which client is in

module.exports = function(sockets) {
    this.ioSockets = sockets;


    this.ioSockets.on('connection', function(socket){

        /**
         * Send back map options and last messages, also add user to room,
         * if not exist initalize
         */
        socket.on('google/connected', function(object){

            socket.join(object.roomId);
            var roomData = require('../models/GoogleRoom');
            if(!googleRooms.hasOwnProperty(object.roomId)){
                googleRooms[object.roomId] = roomData;
            }else {
                roomData = googleRooms[object.roomId];
            }

            socket.emit('google/initialization', roomData);
        }.bind(this))


        /**
         * Emit message to everyone in room
         */
        socket.on('google/chat/message/send', function(data){
            var roomId   = data.roomId;
            var username = socket.handshake.user.username;
            var message  = data.message;

            var ejsTemplate = fs.readFileSync(__dirname + '/../views/message_template.ejs', 'utf8');
            var html        = ejs.render(ejsTemplate, {username: username, message: message});

            while(googleRooms[data.roomId].messages.length > 10) {
                googleRooms[data.roomId].messages.shift();
            }
            googleRooms[data.roomId].messages.unshift({username : username, message: message});

            this.ioSockets.in(roomId).emit('google/chat/message/receive', html)
        }.bind(this))


        socket.on('google/map/zoom/get', function(data){
            googleRooms[data.roomId].zoom = data.zoom;
            googleRooms[data.roomId].mapCenter.lat = data.lat;
            googleRooms[data.roomId].mapCenter.lng = data.lng;

            socket.broadcast.to(data.roomId).emit('google/map/zoom/set', data);
        })

        socket.on('google/map/center/get', function(data){
            googleRooms[data.roomId].mapCenter.lat = data.lat;
            googleRooms[data.roomId].mapCenter.lng = data.lng;

            socket.broadcast.to(data.roomId).emit('google/map/center/set', data);
        })

    }.bind(this))

}