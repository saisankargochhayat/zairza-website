var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var blog = new Schema({
	author : String	,
	title : String ,
	link : String ,
	img : String ,
})

var alumni = new Schema({
	name : String,
	year : String,
	wentTo : String,
	phone : String,
	mail : String,
	link : String,
	img : String
})

var announcement = new Schema({
	from : String,
	datetime : Date,
	title : String,
	body : String,
	img : String
})

var member = new Schema({
	name : String,
	link : String,
	img : String
})

var newsletter = new Schema({
	issue : String,
	img : String
})

var Alumni = mongoose.model("alumni", alumni),
	Announcement = mongoose.model("announcement", announcement),
	Member = mongoose.model("member", member),
	Blog = mongoose.model("blog", blog),
	newsletter = mongoose.model("newsletter", newsletter);

exports.expected_fields = {
	alumni : ["name","year","wentTo","phone","mail","link","img"],
	announcement : ["from","datetime","title","body","img"],
	member : ["name","link","img"],
	blog : ["author","title","link","img"],
	newsletter : ["issue","img"]
}

exports.collection = {
	alumni : Alumni,
	announcement : Announcement,
	member : Member,
	blog : Blog,
	newsletter : newsletter
}

