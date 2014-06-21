var socket    = io.connect('http://' + location.host);
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

    socket.on('room/join/get', function(data){
        if(data.failure) {
            var selector = '#' + data.id + ' .modal-header-errors'
            var info = $(selector);
            info.empty();
            info.append(data.failure);
        }else {
            window.location.href = window.location.origin + data.redirect;
        }
    })

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