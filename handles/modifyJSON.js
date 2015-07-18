//================ Handle to modify an already present JSON file ================// 
//requires updateFile
//path inbound/modify
var fs = require('fs'),
	path = require('path');

updateFile = function(updatedObj){
  console.log('request for updateJSON '+updatedObj.target);
  var fpath = path.join(process.cwd(),'public/',updatedObj.target);
  fs.writeFile(fpath,JSON.stringify(updatedObj.fileObj, null, 4),function(err){
    if(err){console.log(err)}
  })
}

module.exports = function(request, response){
	var requestBody = '';
    request.on('data', function(data) {
    requestBody += data;
	})
	request.on('end', function() {
    	var decodedBody = JSON.parse(requestBody);
    	updateFile(decodedBody);
    	response.send(JSON.stringify({result:'success',time:new Date()}));
	})
}
