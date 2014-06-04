$(document).ready(function(){

    var socket    = io.connect('http://localhost:3000');
    var roomClass = new RoomsClass(socket);

    /** Emitted when first time connected */
    socket.emit('connected', {type: 'rooms'});

    /** Accepts amount of people in room */
    socket.on('rooms', function(rooms){

    })

    /** Accepts connection, when room is created */
    socket.on('rooms/create', roomClass.roomCreate)

    /** Send information about room which user joined and removes him from main room lobby */
    $('.room-join').on('click', roomClass.roomJoin)

})