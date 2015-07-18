//use tags separated by comma [no spaces]

var fs = require('fs'),
	path = require('path');

// Equivalent to a database operation to read a record
var getbase = function(name){
	// read a perticular json file specified by pageId
	var base = {};
	try{
		base = JSON.parse(fs.readFileSync(path.join(process.cwd(),'/public/shared/data/'+name+'.json'))); 
	}
	catch(e){
		// read error is logged , base remains empty object
		// this should generally happen for a new page creation
		console.log('read error has occoured');
		console.log(e);
	}
	return base;
}

// Equivalent of a database write or modify operation
var saveBase = function(name, base){
	//create new file Json or overwite old in name of pageId.
	try{
		fs.writeFileSync(path.join(process.cwd(),'/public/shared/data/'+name+'.json'), JSON.stringify(base,null,2));
	}
	catch(e){console.log('base write error:'+e)}
}

// add tags from page to json file as {tag:[pageObj1, pageObj2, ...]}
// Input tagfield: raw input from tag field of the page
// PageId : of origin page
var addTags = function (tagfield, pageId, pageTitle) {	
	var base = getbase('tagDB');
	var tags = tagfield.split(',');
	for (tag in tags){
		if (!base.hasOwnProperty(tags[tag])) {
			base[tags[tag]] = new Array({id:pageId,title:pageTitle});
		} else{
			base[tags[tag]][base[tags[tag]].length] = {id:pageId,title:pageTitle};
		};
	}
	saveBase('tagDB', base);
	
	// In an another db stores a KAMCHALU {pageID:[tag1, tag2, ...]} 
	// this is to facilitate searching
	base = getbase('pageDB');
	base[pageId] = tags;
	saveBase('pageDB', base);
}

//returns array of {title, page_address} ,associated with a perticular tag
//If no tag the tagname found then returns a blank array
var searchByTagName = function(tagname){
	var base = getbase('tagDB');
	if (base.hasOwnProperty(tagname)) {return base[tagname]}
	else return new Array();
}

// should return which tags are present with the peticular page id
var searchByPageId = function(pageId){
	var base = getbase('pageDB');
	if (base.hasOwnProperty(pageId)) {return base[pageId]}
	else return new Array();	
}

// keeps a track of nooftimes a file is viewed
var views = function(fileId){
	var base = getbase('viewsCounter');
	if (base.hasOwnProperty(fileId)) {
		base[fileId] += 1;
	} else{
		base[fileId] = 1;
	};

	saveBase('viewsCounter', base);
	return base[fileId];
}

// response handlers
var getByFileId = function(request, response) {
	var id = request.query.fileId,
	tags = searchByPageId(id),
	noOfViews = views(id);
	response.send({tagArray:tags, views:noOfViews});
}

var getByTagName = function(request, response){
	var tagname = request.query.tagName;
	response.render('tagsearch',{data:searchByTagName(tagname),tag:tagname});
}


// Expose the function to caller
exports.addTags = addTags;
exports.searchByTagName = searchByTagName;
exports.searchByPageId = searchByPageId;
exports.getViews = views;
exports.getBFID = getByFileId;
exports.getBTN = getByTagName;
