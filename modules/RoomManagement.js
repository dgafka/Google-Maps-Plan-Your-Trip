module.exports = function() {

    this.room = require('../models/Room');
    this.user = require('../models/User')


    /**
     * Returns all rooms from database
     */
    this.index  = function(callback){

        this.room.find({}).populate('user').exec(function(err, rooms) {
            var roomsDescription = [];
            for(var i=0; i < rooms.length; i++) {
                var roomDescription = {
                    'name'     : rooms[i].name,
                    'owner'    : rooms[i].user.username,
                    'password' : rooms[i].password == '' ? 'false' : 'true',
                    'id'       : rooms[i].id,
                    'provider' : rooms[i].user.google.googleId ? 'Google' : (rooms[i].user.facebook.facebookId ? 'Facebook' : (rooms[i].user.twitter.twitterId ? 'Twitter' : 'Local'))
                }
                roomsDescription.push(roomDescription)
            }

            callback(roomsDescription);
        })
    }

    /**
     * Add new room to database
     * @param options
     */
    this.addRoom = function(options, callback) {

        var errors = {
            errorList : [],
            type      : 'warning'
        };

        if(options.roomName.length < 6) {
            errors.errorList.push('Sorry, but room\'s names should be atleast 6 letters long.');
        }
        if(options.roomName.length > 25) {
            errors.errorList.push('Sorry, but room\'s names shouldn\'t longer than 25 letters long.');
        }

        var roomModel = new this.room();
        this.user.findOne({username: options.username}, function(err, user) {
            if(err) {
                return console.error(err);
            }

            if(errors.errorList.length < 1 && user) {
                this.room.findOne({$or : [{user: user}, {name: options.roomName}]}, function(err, room){
                    if(err) {
                        return console.error(err);
                    }
                    if(room) {
                        if(room.name == options.roomName) {
                            errors.errorList.push('Sorry, You can\'t create room, room with such name exist already.');
                        }else {
                            errors.errorList.push('Sorry, but you can\'t create more than one room');
                        }
                    }else {
                        //If no errors arrived, create room :)
                        roomModel.user      = user;
                        roomModel.name      = options.roomName;
                        roomModel.password  = options.password;

                        roomModel.save(function(err){
                            if(err){
                                errors.errorList.push('Sorry, You can\'t create room, there was an unexpected error.');
                                callback(errors);
                            }
                        })
                    }
                    if(errors.errorList.length > 0) {
                        callback(errors)
                    }else {
                        callback(roomModel);
                    }
                })
            }else {
                if(errors.errorList.length < 1) {
                    errors.errorList.push('Sorry, You can\'t create room, there was an unexpected error.');
                }
            }

            //check if any errors arrived
            if(errors.errorList.length > 0) {
                callback(errors);
                return;
            }

        }.bind(this))

    }

    /**
     * Removes room from database
     * @param options
     * @param callback
     */
    this.removeRoom = function(options){

        var room = this.room;
        if(options.username) {

            this.user.findOne({username: options.username}, function(err, user){
                if(err){
                    return console.error(err);
                }

                if(user) {
                    room.remove({user: user}, function(err){
                        if(err) {
                            return console.error(err);
                        }
                    })
                }
            })
        }else if(options.roomName){
            room.remove({name: options.roomName}, function(err){
                if(err) {
                    return console.error(err);
                }
            })
        }
    }

}