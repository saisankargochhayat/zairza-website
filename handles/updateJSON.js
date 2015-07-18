//=========== this module helps to update an already existing JSON file ===========//

var fs = require('fs'),
    path = require('path');


//main function, reads file and appends new values to them
var writeObject = function (newObject, pathToResourse, replace){
  var fileObject = [];
  var filePath = path.join(process.cwd(),pathToResourse);
  fs.readFile(filePath, "binary", function(err, file) {
    if (err) {console.log(err)}
    else{
      fileObject = JSON.parse(file);
      if (replace) {fileObject.pop()};
      fileObject.unshift(newObject);
      var jsonString = JSON.stringify(fileObject, null, 2);
      fs.writeFile(filePath, jsonString, function(err) {
        if (err) {console.log(err)}
      })
    }
  })
}

var Formated = function(obj){
  var newObj = obj;
  delete newObj.key;
  delete newObj.type;
  delete newObj.update;
  return newObj;
};

module.exports = function(request, response){

  var requestBody = '';
  request.on('data', function(data) {
    requestBody += data;
  })
  request.on('end', function() {
    var decodedBody = JSON.parse(requestBody);
    console.log(decodedBody);
    var fulltarget, previewtarget;
    switch(decodedBody.type){
      case 'announce': 
        fulltarget='public/shared/data/announcements.all.json'; 
        previewtarget='public/shared/data/announcements.recent.json';
        break;
      case 'post':
        fulltarget='public/shared/data/posts.all.json'; 
        previewtarget='public/shared/data/posts.recent.json';
        break;
      case 'alumni': 
        fulltarget='public/shared/data/alumni.json'; 
        previewtarget=''; //no preview
        break;
      case 'member': 
        fulltarget='public/shared/data/members.json'; 
        previewtarget=''; //no preview
        break;     
    }
    //for blog and announce ment type data 
    if (decodedBody.update) {
        writeObject(Formated(decodedBody),previewtarget,true);
    }
    //for ever one, since process is async, we are assuming everything
    //to be allright, have to fix it   
    writeObject(Formated(decodedBody),fulltarget,false);

    //reply success
    response.send(JSON.stringify({result:'success',time:new Date()}));
  })
}
