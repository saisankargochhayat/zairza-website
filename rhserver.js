#!/bin/env node
var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'

var http = require('http'),
path = require("path"),
url = require("url"),
fys = require("fs");
var mkdirp = require('mkdirp');

var AuthKey = 'aA123' ;

var recursive_path = function(Path){
  fys.mkdir(Path,function(err){
    if (err) {
      if (err.errno==-4058 || err.errno==34 && err.code!='EEXIST') {
        recursive_path(path.dirname(Path));
        recursive_path(Path);
      };
    };
  })
};

var writeFileRecursive = function(Full_Path, data){
  var f_path = path.dirname(Full_Path);
  fys.writeFile(Full_Path,data,function(err){
    if (err){
      if (err.errno==-4058 || err.errno==34 && err.code=='ENOENT') {
          recursive_path(f_path);
          writeFileRecursive(Full_Path, data);
      }
    } else{console.log(err);};
  });
};

var writeObject = function (newObject, pathToResourse, replace){
  var fileObject = [];
  var filePath = path.join(process.cwd(),pathToResourse);
  fys.readFile(filePath, "binary", function(err, file) {
    if (err) {console.log(err); return err;}
    else{
      fileObject = JSON.parse(file);
      if (replace) {fileObject.pop();};
      fileObject.unshift(newObject);
      var jsonString = JSON.stringify(fileObject,' ');
      fys.writeFile(filePath, jsonString, function(err) {
        if (err) {console.log(err); return err;}
      });
    }
  });
  return 'success';
};

var writeFile = function(newfileObj){
  var filePath = path.join(process.cwd(),newfileObj.target);
  var fileBuffer = new Buffer(newfileObj.base64Stream, 'base64');
  writeFileRecursive(filePath,fileBuffer);  
  return "success";
},
updateFile = function(updatedObj){
  console.log(updatedObj.target);
  var fpath = path.join(process.cwd(),updatedObj.target);
  fys.writeFile(fpath,JSON.stringify(updatedObj.fileObj),function(err){
    console.log(err);
  });
}

var keyless = function(obj){
  var newObj = obj;
  delete newObj.key;
  delete newObj.type;
  delete newObj.update;
  return newObj;
};

http.createServer(function(request,response){
	
	console.log(request.method+':'+request.url);
	
	

    if (request.method == 'GET') {
      var fol = false;
      var my_path = url.parse(request.url).pathname;
      if (my_path[my_path.length-1] == '/') {my_path+='index.html'};
      var full_path = path.join(process.cwd(),my_path);
    	
      fys.exists(full_path, function (exists) {
	  	    if(!exists){
              console.log("file not found: "+full_path);
            if (path.extname(full_path)==".html") {
              response.writeHead(302, {'Location': '/404.html'});
            } else{
            	response.writeHeader(404, {"Content-Type": "text/plain"});  
        	    response.write("404 Not Found\n");
            }  
    	        response.end();
	        }
        	else{
        		fys.readFile(full_path, "binary", function(err, file) {  
                	if(err) {  
                     	response.writeHeader(500, {"Content-Type": "text/plain"});  
                     	response.write(err + "\n");  
                    	response.end();
                	}  
                 	else{
                      switch(path.extname(full_path))
                      {
                        case '.css': response.writeHeader(200,{"Content-Type": "text/css"});
                        break;
                        case '.html': response.writeHeader(200,{"Content-Type": "text/html"});
                        break;
                        case '.js': response.writeHeader(200,{"Content-Type": "text/javascript"});
                        break;
                        case '.pdf': response.writeHeader(200,{"Content-Type": "application/pdf"});
                        break;
                        default: response.writeHeader(200);
                      }
                    	response.write(file, "binary");  
                    	response.end();
                	}
            	});
        	}
		  });
    }

    else if(request.method === "POST") {
    	if (request.url === "/inbound/update") {
      		var requestBody = '';
      		request.on('data', function(data) {
        		requestBody += data;
        		if(requestBody.length > 1e7) {
          			response.writeHead(413, 'Request Entity Too Large', {'Content-Type': 'text/plain'});
          			response.end('413, Request Entity Too Large');
        		}
      		});
      	  request.on('end', function() {
            var decodedBody = JSON.parse(requestBody);
        		console.log(decodedBody);
            var fulltarget, previewtarget;
            if(decodedBody.key == AuthKey){
              switch(decodedBody.type){
                case 'announce': 
                  fulltarget='/shared/data/announcements.all.json'; 
                  previewtarget='/shared/data/announcements.recent.json';
                  break;
                case 'post':
                  fulltarget='/shared/data/posts.all.json'; 
                  previewtarget='/shared/data/posts.recent.json';
                  break;
                case 'bug': 
                  fulltarget='/shared/data/bugs.all.json'; 
                  previewtarget=''; //no preview
                  break;
                case 'alumni': 
                  fulltarget='/shared/data/alumni.json'; 
                  previewtarget=''; //no preview
                  break;
                case 'member': 
                  fulltarget='/shared/data/members.json'; 
                  previewtarget=''; //no preview
                  break;     
              }
              if (decodedBody.update) {
                writeObject(keyless(decodedBody),previewtarget,true);
              };
              var ret = writeObject(keyless(decodedBody),fulltarget,false);
              if ( ret == 'success'){
                response.writeHead(200, {'Content-Type': 'text/plain'});
                response.write('New Entry Created');
                response.write("@ \n");
                response.end(JSON.stringify(new Date()));
              } else{
                response.writeHead(200, {'Content-Type': 'text/plain'});
                response.write('Error:');
                response.end(ret);
              };
            }
            else{
              response.writeHead(200, {'Content-Type': 'text/plain'});
              response.end('Error : Key validation error');
            }
          });
    	} 
      else if (request.url === "/inbound/newFile") {
          var requestBody = '';
          request.on('data', function(data) {
            requestBody += data;
            if(requestBody.length > 1e7) {
                response.writeHead(413, 'Request Entity Too Large', {'Content-Type': 'text/plain'});
                response.end('413, Request Entity Too Large');
            }
          });
          request.on('end', function() {
            var decodedBody = JSON.parse(requestBody);
            console.log(decodedBody.target);
            if(decodedBody.key == AuthKey){
              if('/' == path.dirname(decodedBody.target)){
                decodedBody.target = path.join('/usr',decodedBody.target)};
              var ret = writeFile(decodedBody);
              if ( ret == 'success'){
                response.writeHead(200, {'Content-Type': 'text/plain'});
                response.end('New File Created @'+JSON.stringify(new Date()));
              } else{
                response.writeHead(200, {'Content-Type': 'text/plain'});
                response.write('Error:');
                response.end(ret);
              };
            }
            else{
              response.writeHead(200, {'Content-Type': 'text/plain'});
              response.end('Error : Key validation error');
            }
          });
      } 
    	
  	  else if (request.url === "/inbound/modify") {
          var requestBody = '';
          request.on('data', function(data) {
            requestBody += data;
            if(requestBody.length > 1e7) {
                response.writeHead(413, 'Request Entity Too Large', {'Content-Type': 'text/plain'});
                response.end('413, Request Entity Too Large');
            }
          });
          request.on('end', function() {
            var decodedBody = JSON.parse(requestBody);
            if(decodedBody.key == AuthKey){
              console.log(decodedBody);
              updateFile(decodedBody);
              response.writeHead(200, {'Content-Type': 'text/plain'});
              response.end('successful modification @'+JSON.stringify(new Date()));
            }
            else{
              response.writeHead(200, {'Content-Type': 'text/plain'});
              response.end('Error : Key validation error');
            }
          });
      }

      //inbound type undefined
      else {
        response.writeHead(404, 'Resource Not Found', {'Content-Type': 'text/plain'});
        response.end('404, Resource Not Found');
      }

    }   
  	else {
    response.writeHead(405, 'Method Not Supported', {'Content-Type': 'text/plain'})  ;
    return response.end('405: Method Not Supported');
  	}
    
    //console.log(full_path);
	

}).listen(server_port, server_ip_address, function () {
  console.log( "Listening on " + server_ip_address + "," + server_port )
});