var fs = require("fs"),
	path = require("path") ;

exports.showFiles = function (req, res) {
	var targetFolder = path.join(process.cwd()+"/public/"+req.query.folder);
	fs.readdir(targetFolder, function(err, files){
		if (err) {
			res.send("Error reading filesystem !");
			console.log("Error: Reading filesystem\n"+err);
		}else{
			res.send(JSON.stringify(files));
		}
	})
}