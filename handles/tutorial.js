var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var page = new Schema({
    fileid: String,
    placement: String,
    savePosition: String,
    title : String,
    head_title : String,
    contributers : String,
    mainbody : String,
    tagfield : Array
});

page.methods.removeFormatting = function (str) {
    return str.split(/<\/*\w*>/).join('');
}

var Page = mongoose.model('tutorial_pages', page);

exports.savePage = function (request, response){

    //dObj: recieved object from post command on the page
    //format should be {title, contributers, mainbody, tagfield, fileid, placement, savePosition}
    dObj = request.body;

    var newPage = new Page();
    try{
        newPage.fileid = dObj.fileid;
        newPage.placement = dObj.placement;
        newPage.savePosition = dObj.savePosition;
        newPage.title = dObj.title;
        newPage.head_title = newPage.removeFormatting(dObj.title);
        newPage.contributers = dObj.contributers;
        newPage.mainbody = dObj.mainbody;
        newPage.tagfield = dObj.tagfield.split(",");
        console.log(newPage);
    }
    catch(err){console.error("Error:generate newPage \n"+err)}

    newPage.save(function(err) {
        if (err){
          console.error("Error:create newPage\n"+err) 
          response.status(500).send("Create Page Error");
        }else response.send("success");
    });

    /*
    if (dObj.update) {        
        //try saving this new page
        Page.update({fileid:newPage.fileid},newPage,function(err) {
        if (err){ 
            console.error("Error:Update newPage\n"+err)
            response.status(500).send("Page Update Error");
        }else response.send("success");
        })
    } else{*/
        //try saving this new page
        
   // };
     
}

exports.getPageById = function(request, response){
    var id = request.query.id;
    Page.findOne({fileid:id}, function(err, page){
        if (err){
          console.error("Error:retrive by pageid\n"+err) 
          response.status(500).send("Page search Error");
        }else response.send(JSON.stringify(page));
    })
} 

exports.findPageByTagName = function(request,response){
    var tagname = request.query.tagname;
    Page.find({tagfield: {$in:[tagname]}},function(err, pageArray){
        if (err){
          console.error("Error:tag search\n"+err) 
          response.status(500).send("Tag Search Error");
        }else response.send(JSON.stringify(pageArray));
    })
}

//returns an object containg all entries segregated by type
exports.getJournal = function(request, response){
    var type = request.query.typename;
    Page.find({savePosition:type},function(err, data){
        if (err){
          console.error("Error:getJournal\n"+err) 
          response.status(500).send("Error searching database");
        }else response.send(JSON.stringify(data));
    })
}


/*=========  Views Counter  ==========*/
var _view_counter = new Schema({
    pageid  : String,
    views   : Number
})

var view_counter = mongoose.model("view_counter", _view_counter);

exports.getViews = function(request, response){
    var id = request.query.pageid ;
    view_counter.findOne({pageid:id},function(err, data){
        if (err) {console.error("Error:get views\n"+err)
            response.status(500).send("data read error")
        }
        else{
            // if id not in database, create one
            if (!data) {
                data = new view_counter();
                data.pageid = id;
                data.views = 0;
            };
            data.views += 1;
            data.save(function(err){
                if (err) {
                    console.error("Error:saving views\n"+err)
                }else{
                    response.send(data.views.toString());
                };
            });
        }        
    })
}