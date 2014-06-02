var mongoose            = require('mongoose');

var roomSchema          = mongoose.Schema({

    name        : {type: String, unique: true, required: true},
    password    : String,
    user        : {type: mongoose.Schema.Types.ObjectId, ref: 'User'}

})

module.exports = mongoose.model('Room', roomSchema)