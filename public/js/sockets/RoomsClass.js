var RoomsClass = function(socket){

    this.socket = socket;

    this.connected  = function(){
        socket.emit('connected', {type: 'rooms'})
    }

    this.roomsReceive = function() {

    }

    /**
     * Send information, that room was created.
     */
    this.roomCreate = function(){
        /** Get all rooms data and send it to socket.io server side, then broadcast */
    }

    this.roomJoin  = function(event){
        /** Send information about room which user joined and removes him from main room lobby */
    }

    this.roomRemove = function() {
        /** Send information, that room was destroyed and removes everyone from inside of room lobby */
    }



}