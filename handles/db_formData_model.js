var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var blogs = new Schema({
	author : String	,
	title : String ,
	link : String ,
	img : String ,
})

