//file inventor ----------------- ---------------------------------
//	This method doesnot solves it's core purpose that is eliminating
//	the race condition. In short it is simply useless

/*generates a random file name, sees if it is present,
 If not then returns that name , else REPEATS itself 
	NOTE: file name is relative to /public/usr/...
	request type :  ?val= relativePath@extension@suggestedname
 */
var fs = require('fs'),
	path = require('path'),
	fscustom = require('./wfr.js')

module.exports = function (req, res) {
	var reqArr = req.query.val.split('@');
	var relativePath = reqArr[0],
		extension = '.'+reqArr[1],
		suggestedname = reqArr[2];

	var fileInventGinie = function(RelativePath, FileName, Extension){
		var fulpath = path.join(process.cwd(),'/public/usr/',RelativePath+FileName+Extension);
		fs.exists(fulpath,function(result){
			if (result){
				console.log(FileName+' already exists')
				FileName += Math.floor(Math.random*10);
				fileInventGinie(RelativePath, FileName, Extension);
			} else{
				(res.send(FileName));
				fscustom.writeFile(fulpath,"thisfileNowExists")
			}
		})	
	}
	
}