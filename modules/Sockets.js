var ejs = require('ejs');
var fs  = require('fs');

module.exports = function(sockets) {
    this.ioSockets = sockets;


    /**
     * On connection arrived
     * @param type
     * @param callback
     */
    this.connected = function(type, callback){
        if(type == 'rooms') {
            this.connectedRooms(callback);
        }
    }


    /**
     * Get all rooms with html template
     * @param callback
     */
    this.connectedRooms = function(callback) {
        var roomManagement = require('../modules/RoomManagement');
        var roomHelper     = new roomManagement();
        var html           = '';

        roomHelper.index(function(rooms){
            for(var i=0; i<rooms.length; i++){
                rooms[i].onlineUsers = 0;
            }
            var ejsTemplate = fs.readFileSync(__dirname + '/room_template.ejs', 'utf8');
            html            += ejs.render(ejsTemplate, rooms[i]);
        });

        callback(html);
    }


    this.ioSockets.on('connection', function(socket){

        socket.on('connected', function(){
            this.connected();
        }.bind(this))

    })

}