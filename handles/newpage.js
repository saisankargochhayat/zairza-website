var fs = require('fs'),
    path = require('path'),
    tconv = require('./tconv.js'),
    tag = require('./tags.js');

module.exports = function (request, response){
    
    //dObj: recieved object from post command on the page
    //format should be {title, contributers, mainbody, tagfield, fileid, placement, savePosition}
    dObj = request.body;
    //console.log(dObj);
    
    //read a html templatefile
    var template = fs.readFileSync('templates/newDoc.html',"utf-8");

    //create a html page by processing template with recieved object 
    var htmlpage = tconv(template,dObj,'@!');

    //save the newly creted html page
    var fpth = path.join(process.cwd(),'public/usr/docs/',dObj.fileid+'.html');
    //console.log('path='+fpth);
    fs.writeFile(fpth, htmlpage, function(err){
    if(err){console.log(err)}
    })

    //save the tags from the page
    // check that dObj must contain required feild
    tag.addTags(dObj.tagfield, dObj.fileid, dObj.title);

    //add the newly created page in one of the categories
    switch(dObj.savePosition){
        case 'Manual': fupd({title:dObj.title,id:dObj.fileid}, 'public/shared/data/Manual.json');
        break;

        case 'Electronics': fupd({title:dObj.title,id:dObj.fileid}, 'public/shared/data/Electronics.json');
        break;

        case 'Avr':fupd({title:dObj.title,id:dObj.fileid}, 'public/shared/data/Avr.json');
        break;

        case 'Arduino': fupd({title:dObj.title,id:dObj.fileid}, 'public/shared/data/Arduino.json');
        break;

        case  'M_Robotics': fupd({title:dObj.title,id:dObj.fileid}, 'public/shared/data/M_Robotics.json');
        break;

        case 'Web': fupd({title:dObj.title,id:dObj.fileid}, 'public/shared/data/Web.json');
        break;

        case  'Languages': fupd({title:dObj.title,id:dObj.fileid}, 'public/shared/data/Languages.json');
        break;

        case 'Standalone': fupd({title:dObj.title,id:dObj.fileid}, 'public/shared/data/Standalone.json');
        break;

        case 'E_Software': fupd({title:dObj.title,id:dObj.fileid}, 'public/shared/data/E_Software.json');
        break;

        case 'SAE': fupd({title:dObj.title,id:dObj.fileid}, 'public/shared/data/SAE.json');
        break;

        case 'ASME': fupd({title:dObj.title,id:dObj.fileid}, 'public/shared/data/ASME.json');
        break;

        case 'M_Automobile': fupd({title:dObj.title,id:dObj.fileid}, 'public/shared/data/M_Automobile.json');
        break;
    }

    //reply back to the page
    response.send('Your Page has been generated');
}

var fupd = function (newObject, pathToResourse){
  var fileObject = [];
  var filePath = path.join(process.cwd(),pathToResourse);
  fs.readFile(filePath, "utf-8", function(err, file) {
    if (err) {console.log(err)}
    else{
      fileObject = JSON.parse(file);
      fileObject.unshift(newObject);
      var jsonString = JSON.stringify(fileObject, null, 2);
      fs.writeFile(filePath, jsonString, function(err) {
        if (err) {console.log(err)}
      })
    }
  })
}