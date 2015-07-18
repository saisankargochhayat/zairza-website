var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    var bcrypt   = require('bcrypt-nodejs');

var Account = new Schema({
    Gid      : String,
    token    : String,
    email    : String,
    name     : String,
  	password : String,
  	IsActivated : Boolean 
});


Account.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
Account.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', Account);