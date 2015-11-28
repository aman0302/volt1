var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');


var deviceSchema =mongoose.Schema({

    deviceName:String,
    deviceType:String,

});


var homeSchema = mongoose.Schema({

    homeName:String,
    hasRooms:[
        {
            roomName:String,
            hasDevices:[deviceSchema],
        }
    ],

});


// define the schema for our user model
var userSchema = mongoose.Schema({

    local            : {
        email        : String,
        password     : String,
    },

    profile :{
        email: String,
        password: String,
        name:String,
    },

    components:{
        ownerOf :homeSchema,
        residentOf:[homeSchema],
        guestOf:[homeSchema],
    }

});




// methods ======================
// generating a hash
userSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);