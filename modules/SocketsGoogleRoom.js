var ejs = require('ejs');
var fs  = require('fs');
var googleRooms = [];

//this.ioSockets.manager.roomClients[socket.id] awesome get all rooms which client is in

module.exports = function(sockets) {
    this.ioSockets         = sockets;
    this.uniqueIdGenerator = require('node-uuid');

    this.ioSockets.on('connection', function(socket){

        /**
         * Send back map options and last messages, also add user to room,
         * if not exist initalize
         */
        socket.on('google/connected', function(object){

            var roomId  = object.roomId;

            socket.join(object.roomId);
            var roomData = {
                id          : roomId,
                messages    : [],
                mapCenter   : {
                    lat: 52.06600028274564,
                    lng: 19.35791015625
                },
                zoom        : 7,
                markers     : [],
                type        : 'roadmap',
                streetView  : {
                    isOn: false,
                    lat : 52.06600028274564,
                    lng : 19.35791015625
                }
            };
            var found    = false;
            if(googleRooms.hasOwnProperty(object.roomId)){
                roomData = googleRooms[roomId];
                found    = true;
            }

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


        /**
         * Emits zoom change to everyone in the room
         */
        socket.on('google/map/zoom/change', function(data){
            googleRooms[data.roomId].zoom = data.zoom;
            socket.broadcast.to(data.roomId).emit('google/map/zoom/set', data.zoom);
        });

        /**
         * Emits new map center to everyone in the room
         */
        socket.on('google/map/center/change', function(data){
            var object = googleRooms[data.roomId];
            object.mapCenter.lat = data.lat;
            object.mapCenter.lng = data.lng;

            socket.broadcast.to(data.roomId).emit('google/map/center/set', data);
        });

        /**
         * Emits marker creation to everyone in the room
         */
        socket.on('google/map/marker/change', function(data){
            //generate unique id based on timestamp
            var markerId = this.uniqueIdGenerator.v1();
            var marker = {
                id : markerId,
                lat: data.lat,
                lng: data.lng
            };
            var object = googleRooms[data.roomId];
            object.markers.push(marker);

            this.ioSockets.in(data.roomId).emit('google/map/marker/set', marker);
        }.bind(this));

        /**
         * Emits new position of the marker to everyone in the room.
         */
        socket.on('google/map/marker/position/change', function(data){
            googleRooms[data.roomId].markers.forEach(function(marker){
                if(marker.id == data.id) {
                    marker.lat = data.lat;
                    marker.lng = data.lng;
                }
            });
            socket.broadcast.to(data.roomId).emit('google/map/marker/position/set', data);
        })


        /**
         * Emits map new map type to everyone in the room
         */
        socket.on('google/map/type/change', function(data){
            googleRooms[data.roomId].type = data.mapType;
            socket.broadcast.to(data.roomId).emit('google/map/type/set', data.mapType);
        })

        /**
         * Emits new state of panorama
         */
        socket.on('google/map/panorama/change', function(data){
            var streetView = googleRooms[data.roomId].streetView;
            streetView.isOn = data.isOn;
            streetView.lat  = data.lat;
            streetView.lng  = data.lng;

            socket.broadcast.to(data.roomId).emit('google/map/panorama/set', data);
        })


    }.bind(this));

};