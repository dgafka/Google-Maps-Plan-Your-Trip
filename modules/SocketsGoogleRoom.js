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

            var roomId  = object.roomId;

            socket.join(object.roomId);
            var roomData = require('../models/GoogleRoom');
            var found    = false;
            googleRooms.forEach(function(room){
                if(object.roomId == room.id){
                   roomData = googleRooms[roomId];
                   found    = true;
                }
            });

            if(!found) {
                roomData.id = roomId;
                googleRooms[roomId] = roomData;
            }

            socket.emit('google/initialization', roomData);
        }.bind(this));


        /**
         * Emit message to everyone in room
         */
        socket.on('google/chat/message/send', function(data){
            var roomId   = data.roomId;
            var username = socket.handshake.user.username;
            var message  = data.message;

            var ejsTemplate = fs.readFileSync(__dirname + '/../views/message_template.ejs', 'utf8');
            var html        = ejs.render(ejsTemplate, {username: username, message: message});

            while(googleRooms[data.roomId].messages.length > 6) {
                googleRooms[data.roomId].messages.shift();
            }
            googleRooms[data.roomId].messages.unshift(html);

            this.ioSockets.in(roomId).emit('google/chat/message/receive', html);
        }.bind(this));


        socket.on('google/map/zoom/get', function(data){
            var object = googleRooms[data.roomId];
            object.zoom = data.zoom;
            object.mapCenter.lat = data.lat;
            object.mapCenter.lng = data.lng;

            socket.broadcast.to(data.roomId).emit('google/map/zoom/set', data);
        });

        socket.on('google/map/center/get', function(data){
            var object = googleRooms[data.roomId];
            object.mapCenter.lat = data.lat;
            object.mapCenter.lng = data.lng;

            socket.broadcast.to(data.roomId).emit('google/map/center/set', data);
        });

        socket.on('google/map/marker/get', function(data){
            var marker = {
                lat: data.lat,
                lng: data.lng
            };
            var object = googleRooms[data.roomId];
            object.markers.push(marker);

            socket.broadcast.to(data.roomId).emit('google/map/marker/set', marker);
        });

    }.bind(this));

};