var socket      = io.connect('http://' + location.host);
var map;
var mapListeners = [];

$(document).ready(function(){
    var roomId = $('.google-room-chat').attr('id');
    var chatManagement = new Chat(socket);
    var mapsManagement = new GoogleMaps(socket, roomId);

    //
    // SOCKETS MANAGEMENT
    //

    /** Emitted when first time connected */
    socket.emit('google/connected', {roomId : roomId});

    /**
     * initalization of chat and map
     */
    socket.on('google/initialization', function(data){
        chatManagement.initalize(data);
        map = mapsManagement.initalize(data);
        addGoogleMapsEvents(map);

        data.markers.forEach(function(marker){
            mapsManagement.onRightClickSet(marker);
        }.bind(this));
        //inicjalna data, tworzenie mapy zapendowanie messaegow
    });

    /**
     * Called when message is received message
     */
    socket.on('google/chat/message/receive', function(data){
        chatManagement.receiveMessage(data);
    });

    /**
     * Set zoom
     */
    socket.on('google/map/zoom/set', function(data){
        globalState = true;
        mapsManagement.onZoomChangedSet(data);
  });

    /**
     * Set center of the mpa
     */
    socket.on('google/map/center/set', function(data){
        mapsManagement.onCenterChangedSet(data);
    }.bind(this));


    socket.on('google/map/marker/set', mapsManagement.onRightClickSet);

    //
    // DOM EVENTS
    //
    $('#message_send').on("click", function(event){
        chatManagement.sendMessage(roomId);
        $('#chat_input').val('');
    }.bind(this));

    $('#chat_input').keypress(function(e) {
        if(e.which == 13) {
            chatManagement.sendMessage(roomId);
        }
    });

    $('#chatHideVisible').on("click", function(event){
        $('.google-room-chat').toggleClass('hidden-display-chat');
        $('#map-canvas').toggleClass('hidden-display');
    });

    //
    //GOOGLE MAPS EVENTS
    //
    var addGoogleMapsEvents = function() {
        mapListeners.zoom_changed = google.maps.event.addListener(map, 'zoom_changed', mapsManagement.onZoomChangedGet);
        mapListeners.dragend      = google.maps.event.addListener(map, 'dragend', mapsManagement.onCenterChangedGet);
        mapListeners.rightclick   = google.maps.event.addListener(map, 'rightclick', mapsManagement.onRightClickGet);
        google.maps.event.addDomListener(window, "resize", function() {
            var center = map.getCenter();
            google.maps.event.trigger(map, "resize");
            map.setCenter(center);
        });
    };
});
