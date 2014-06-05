var Chat = function(socket){

    this.socket = socket;

    this.initalize = function(data) {
        var messages = data.messages.reverse();
        data.messages.forEach(function(message){
            this.receiveMessage(message);
        }.bind(this));
    };

    /**
     * Send message to clients in room
     * @param message
     */
    this.sendMessage = function(roomId){
        //Manipulate data
        var input   = $('#chat_input');
        var message = input.val();

        var data = {
            roomId : roomId,
            message: message
        };

        socket.emit('google/chat/message/send', data);
        //Prevent submiting the form
        input.val('');
        event.preventDefault();
    };

    /**
     * Recieves messages from clients
     * @param data
     */
    this.receiveMessage = function(data) {
        $('#chat_box').append(data);
    };

};