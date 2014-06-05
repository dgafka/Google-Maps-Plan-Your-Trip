var RoomsClass = function(socket){

    this.socket = socket;

    this.connected  = function(){
        socket.emit('connected', {type: 'rooms'})
    }

    /**
     * Send information, that room was created.
     */
    this.roomCreate = function(results){
        /** Get all rooms data and send it to socket.io server side, then broadcast */
        results = JSON.parse(results);
        $('.modal-header-errors').empty();

        if(!(results.type == "success")){
            results.errorList.forEach(function(result){
                $('.modal-header-errors').append(
                    "<div class=\"alert alert-" + results.type + "\">" + result + "</div>"
                )
            })
        }else {
            $('.modal.fade').modal('hide')
        }
    }

    this.roomJoin = function(event){
        console.log('a');
        event.preventDefault();
    }

    this.roomRemove = function() {
        /** Send information, that room was destroyed and removes everyone from inside of room lobby */
    }



}