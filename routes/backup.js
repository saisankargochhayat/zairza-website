var fs = require('fs'),
	path = require('path');

var _backup_positions = ["public/upload/", "public/usr/images", "public/tutorials/images/uploaded"] ;

var X = function(filename, dummy_name, src){
	return  {
				_name : filename ,
				_dummy_name : dummy_name ,
				_src_loc : src
			}
}

var moveFiles = function(src, dstn, backup){
	var JsonRecord = [] ;
	fs.readdir(src, function(err, files){
		if (err) {
			console.log("Error: reading list of files from source\n"+err);
		}else{
			console.log(files);
			files.forEach(function(filename, index, array){
				fs.readFile(path.join(src,filename), function(err, FILE){
					if (err) {
						console.log(filename+":This is a dir");
					}else{
						if (backup) {
							dummy_name = Date.now().toString() + Math.ceil(Math.random()*1000);
							JsonRecord.push(X(filename, dummy_name, src)) ;
							fs.writeFileSync(dstn+"/__original_values.json", JSON.stringify(JsonRecord,null,2)) ;
							console.log(dstn+dummy_name);
							fs.writeFileSync(dstn+dummy_name, FILE);
						} else{
							fs.writeFileSync(path.join(dstn,filename), FILE);
						};
					}
				})
			})
		}
	})
}

var backup = function(relative_src, X_dir){
	var source = path.join(process.cwd(), relative_src) ;
	var dest = path.join("/tmp/website/", X_dir);
	console.log(source);
	moveFiles(source, dest, true);
}

var restore = function(_src){
	var _master_file = JSON.parse(fs.readFileSync(path.join(_src, "__original_values.json")));
	_master_file.forEach(function(_file_record, index, array){
		FILE = fs.readFileSync(path.join(_src,_file_record._dummy_name));
		fs.writeFileSync(path.join(_file_record._src_loc, _file_record._name),FILE);
	})	
}

var _backup = function(req, res){
	_backup_positions.forEach(function(ele, indx, array){
		backup(ele, "/"+indx+"/");
	})
	res.send("Done!");
}

var	_restore = function(req, res){
	var dirs = fs.readdirSync("/tmp/website/");
	dirs.forEach(function(dir,indx,array){
		restore(path.join("/tmp/website/", dir, "/"));
	})
	res.send("Done!");
}

exports.backup = _backup ;
exports.restore = _restore ;
