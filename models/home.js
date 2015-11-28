var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var homeSchema = mongoose.Schema({

    homeName:String,
    hasRooms:[
        {
            roomName:String,
            hasDevices:[String],
        }
    ],

});

// create the model for users and expose it to our app
module.exports = mongoose.model('Home', homeSchema);