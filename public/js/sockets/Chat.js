var Chat = function(socket){

    this.socket = socket;

    /**
     * Send message to clients in room
     * @param message
     */
    this.sendMessage = function(roomId){
        //Manipulate data
        var message = $('#chat_input').val();

        var data = {
            roomId : roomId,
            message: message
        }

        socket.emit('google/chat/message/send', data);
        //Prevent submiting the form
        event.preventDefault();
    }

    /**
     * Recieves messages from clients
     * @param data
     */
    this.receiveMessage = function(data) {
        $('#chat_box').append(data);
    }

}