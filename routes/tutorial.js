var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    fs = require('fs');

var _page = new Schema({
    fileid: String,
    placement: String,
    savePosition: String,
    title : String,
    head_title : String,
    contributers : String,
    mainbody : String,
    tagfield : Array
});

_page.methods.removeFormatting = function (str) {
    return str.split(/<\/*\w*>/).join('');
}
_page.methods.fill_new_content = function(newObject, replacement_object){    
    try{
        newObject.__creater_id = replacement_object.__creater_id;
        newObject.fileid = replacement_object.fileid;
        newObject.placement = replacement_object.placement;
        newObject.savePosition = replacement_object.savePosition;
        newObject.title = replacement_object.title;
        newObject.head_title = newObject.removeFormatting(replacement_object.title);
        newObject.contributers = replacement_object.contributers;
        newObject.mainbody = replacement_object.mainbody;
        newObject.tagfield = replacement_object.tagfield.split(",");
    }
    catch(err){console.error("Error: Create newObject \n"+err)}
}

//* ==== Main ====*//
var Page = mongoose.model('tutorial_pages', _page);

exports.savePage = function (request, response){

    page_content = request.body;

    if (page_content.type == "new") {
        var newPage = new Page();

        newPage.fill_new_content(newPage, page_content);
        
        newPage.save(function(err) {
            if (err){
            console.error("Error:create new Page\n"+err) 
            response.status(500).send("Create Page Error");
            }else response.send("success");
        });    
    }else if (page_content.type == "edit") {
        Page.findOne({fileid:page_content.fileid},function(err, page){
            if (err) {console.error("Error: Page find\n"+err)};
            if (!page) {console.error("Error: Page find --> No results found")};
            page.fill_new_content(page, page_content);
            page.save(function(err) {
                if (err){
                console.error("Error:Save Modified Page\n"+err) 
                response.status(500).send("Save Modified Error");
                }else response.send("success");
            });    
        })
    }else{
        response.send("Unknown request Type Field");
    }     
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
          console.error("Error:tag search\n"+err);
          response.status(500).send("Tag Search Error");
        }else response.send(JSON.stringify(pageArray));
    })
}

var filterHTML = function (string) {
    var a = string.split(/\s+/).join("|").replace(/(<([^>]+)>)/ig,"|").replace(/,+/,"|").split("|");
    var res = [] ;
    a.forEach(function(e,i,arr){
        if (e.length > 0) {res.push(e)};
    })
    return res ;
} 
var search = function(string, queryTerm){
    var arr = filterHTML(string);
    if(arr.indexOf(queryTerm) != -1){return true ;}
    else {return false ;}
}

exports.searchAllPages = function(request,response){
    var tagname = request.query.tagname;
    var result = [] ;
    var fields = ["title", "tagfield", "contributers", "mainbody"] ;
    Page.find(function(err, data){
        if (err){
          console.error("Error:tag search\n"+err); 
          response.status(500).send("Tag Search Error");
        }else {
            data.forEach(function(page, indx, arr){
                fields.forEach(function(field, field_index, array){
                    var str = page[field].toString();
                    if (search(str,tagname)) {
                        console.log("+");
                        if (result.indexOf(page) == -1) {result.push(page)};
                    }
                })
            })
            response.send(JSON.stringify(result));
        }
    })
}

//returns an object containg all entries segregated by type
exports.getJournal = function(request, response, next){
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

/*Tutorial image upload*/

exports.getImageForm = function(req, res){
  res.send('<form method="post" enctype="multipart/form-data">'
    + '<p>Image: <input type="file" name="image" /></p>'
    + '<p><input type="submit" value="Upload" /></p>'
    + '</form>');
}
exports.getPostImageData = function(req, res){
  if(req.query.CKEditor == 'mainBody'){
    var CKEditorFuncNum = req.query.CKEditorFuncNum;  
    var tmp_path = req.file.path;
    var now = Date.now();
    //date atribute to make each upload unique
    var target_path = 'public/tutorials/images/uploaded/' + now + req.file.originalname ;
    var src = fs.createReadStream(tmp_path);
    var dest = fs.createWriteStream(target_path);
    var url = "./images/uploaded/" + now + req.file.originalname ;
    src.pipe(dest);
    var reply = '<script>window.parent.CKEDITOR.tools.callFunction('
            + CKEditorFuncNum +', "' + url + '");</script>' ;
    src.on('end', function() { res.send(reply.toString())});
    src.on('error', function(err) { res.send('Error, try again'); });
    }else{
        res.send("this feature is supported only on Main body")
    }
 }