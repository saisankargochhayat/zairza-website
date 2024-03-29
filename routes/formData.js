var dbModel = require("./formData_model.js"),
    fs = require("fs");

exports.getData = function(req, res, next){
    var form = req.query.form,
        units = parseInt(req.query.units);
    dbModel.collection[form].find().exec(function(err, data){
        if (err) {
            console.log("Error reading all form data\n"+err)
            res.send(Script("Error, try again later"))
        } else{
            if (units == -1) {
                res.send(JSON.stringify(data));
            } else{
                var temp_data = [];
                for (var i = 0; i < units; i++) {
                    var __temp_data = data.pop();
                    if ((typeof __temp_data === "object") && (__temp_data !== null)) {temp_data.push(__temp_data);}
                }
                 res.send(JSON.stringify(temp_data));
            }
        }
    })
}

exports.getDataById = function(req, res){
    var form = req.query.form,
        id = req.query.id;
    dbModel.collection[form].findById(id,function(err, data){
        if (err) {
            console.log("Error reading all form data\n"+err)
            res.send(Script("Error, try again later"))
        } else{
            res.send(JSON.stringify(data));    
        }
    })
}

exports.ChangeCarousel = function(req,res){

    var tmp_path = req.file.path;
    var target_path = process.cwd()+"/public/images/"+ req.body.pictures+".png" ;
    var src = fs.createReadStream(tmp_path);
    var dest = fs.createWriteStream(target_path);
    src.pipe(dest);
    src.on('end', function() {
        res.send(Script("success"))
    })
    src.on('error', function(err) {
        if (err) {
            console.log("Error saving new file\n"+err)
            res.send(Script("Error, try again later"))
        }
    })
}
exports.InsertData = function (req, res) {
	var form = req.query.form ;
	//iterate through request to find required fields
	var data = {};
    var body = req.body;
    console.log(body);
    var iArray = dbModel.expected_fields[form] ;
	iArray.forEach(function(element, index, array){
        data[element] = body[element]; 
    })
    console.log(data);
	console.log(iArray);
	//if img_src is file then perform file shift operation 
	if (req.body.file == "on") {
    var tmp_path = req.file.path;
    var now = Date.now();
    //date atribute to make each upload unique
    var target_path = 'public/usr/images/' + now + req.file.originalname ;
    var src = fs.createReadStream(tmp_path);
    var dest = fs.createWriteStream(target_path);
    var url = "/usr/images/" + now + req.file.originalname ;
    src.pipe(dest);
    src.on('end', function() {
    	//rename img to new location
    	data.img = url;
    	//create a new form_data model
    	var form_data = new dbModel.collection[form];
    	//populate form_data with values in data 
    	Object.getOwnPropertyNames(data).forEach(function(val, idx, array) {
            form_data[val] = data[val]
        });
    	//try saving this new data into database
    	form_data.save(function(err){
    		if (err) {
    			console.log("Error saving new file\n"+err)
    			res.send(Script("Error, try again later"))
    		}else{res.send(Script("success"))}
    	})
    })
    src.on('error', function(err) {
    	if (err) {
    		console.log("Error saving new file\n"+err)
    		res.send(Script("Error, try again later"))
    }})

	}else{
        //create a new form_data model
        var form_data = new dbModel.collection[form];
        //populate form_data with values in data 
        Object.getOwnPropertyNames(data).forEach(function(val, idx, array) {
            form_data[val] = data[val]
        });
        //try saving this new data into database
        console.log("form_data="+form_data);
        form_data.save(function(err){
            if (err) {
                console.log("Error saving new file\n"+err)
                res.send(Script("Error, try again later"))
            }else{res.send(Script("success"))}
        })
    }
}

exports.uploadFile = function(req, res){ 
	var tmp_path = req.file.path;
    var target_path = process.cwd()+"/public/upload/"+ req.file.originalname ;
    var src = fs.createReadStream(tmp_path);
    var dest = fs.createWriteStream(target_path);
    src.pipe(dest);
    src.on('end', function() {
    	res.send(Script("success"))
    })
    src.on('error', function(err) {
    	if (err) {
    		console.log("Error saving new file\n"+err)
    		res.send(Script("Error, try again later"))
    	}
	})
}

exports.ReplaceData = function(req, res){
    console.log("ok");
    var form = req.query.form,
        id = req.query.id;
        body = req.body;
    dbModel.collection[form].findOne({_id:id},function(err, data){
        console.log("data=");console.log(data);
        if (err) {console.log("Error searching replace item\n"+err)
            res.send(Script("Error, try again later"))
        }else{
                //if img_src is file then perform file shift operation 
            if (body.file == "on") {
                var tmp_path = req.file.path;
                var now = Date.now();
                //date atribute to make each upload unique
                var target_path = 'public/usr/images/' + now + req.file.originalname ;
                var src = fs.createReadStream(tmp_path);
                var dest = fs.createWriteStream(target_path);
                var url = "/usr/images/" + now + req.file.originalname ;
                src.pipe(dest);
                src.on('end', function() {
                    body.img = url;
                    Object.getOwnPropertyNames(body).forEach(function(val, idx, array) {
                        data[val] = body[val]
                    });  
                    data.save(function(err){
                        if (err) {
                            console.log("Error saving replaced item\n"+err) 
                            res.send(Script("Error, try again later")) 
                        } else{
                            res.send(Script("success")) ;
                        }
                    })
                    
                })
                src.on('error', function(err) {
                    if (err) {
                        console.log("Error saving replaced img\n"+err)
                        res.send(Script("Error, try again later"))
                    }
                })
            }else{                
                Object.getOwnPropertyNames(body).forEach(function(val, idx, array) {
                    data[val] = body[val]
                });
                data.save(function(err){
                    if (err) {
                        console.log("Error saving replaced item\n"+err) 
                        res.send(Script("Error, try again later")) 
                    } else{
                        res.send(Script("success")) ;
                    }
                })
                
            }
        }
    })
}

exports.deleteData = function(req, res){
	var form = req.query.form;
    var id = req.query.id;
    dbModel.collection[form].remove({_id:id},function(err){
        if (err) {
            console.log("Error Deleting\n"+err)
            res.send(Script("Error, try again later"))
        } else{res.send(Script("success"))};
    })
}

var Script = function (msg) {
	return '<script>alert("'+msg+'");window.location.href = "/admin/";</script>' ;
}
