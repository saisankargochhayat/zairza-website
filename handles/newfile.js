//============== creates a new file at provide location ==============//
//requires path and custom writeFile

var path = require('path'),
	fsCustom = require('./wfr.js');

var writeFile = function(newfileObj){
  var filePath = path.join(process.cwd(),newfileObj.target);
  var fileBuffer = new Buffer(newfileObj.base64Stream, 'base64');
  fsCustom.writeFile(filePath,fileBuffer);
}


module.exports = function(request, response){
	var requestBody = '';
    request.on('data', function(data) {
    requestBody += data;
	})
	
	request.on('end', function() {
    	var decodedBody = JSON.parse(requestBody);
    	console.log('file write request at'+decodedBody.target);
   		 var Pth = path.dirname(decodedBody.target);
    	if('/' == Pth || '' == Pth){
        	decodedBody.target = path.join('public/usr/',decodedBody.target)}
    	else{decodedBody.target = path.join('public/',decodedBody.target)}
    
    	//*** send response assuming every thing went alright ***/
    	writeFile(decodedBody);
    	response.send(JSON.stringify({result:'success',time:new Date()}));
	})
}
