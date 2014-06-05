var socket    = io.connect('http://192.168.0.197:3000');
$(document).ready(function(){
    var roomsManagement = new RoomsClass(socket);

    /** Emitted when first time connected */
    socket.emit('connected', {type: 'rooms'});

    /**
     * Append rooms to room list, when called
     */
    socket.on('rooms/index', function(html){
        $('#room_storage').append(html);
    });

    /** Accepts connection, when room is created */
    socket.on('rooms/create/client', roomsManagement.roomCreate);

    /** Send information about room which user joined and removes him from main room lobby */
    $('#room_storage a').on('click', roomsManagement.roomJoin);


    $('#room_create_submit').on('click', function(event){
        var name     = $(this).parent().parent().children('.modal-body').children('form').children('#name').children('input').val();
        var password = $(this).parent().parent().children('.modal-body').children('form').children('#password').children('input').val();

        socket.emit('room/create/server', {
            name    : name,
            password: password
        });
    });
});