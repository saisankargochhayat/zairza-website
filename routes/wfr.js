/*writes a string to file. If folder hirarch is absent, automatically creates it*/
var fys = require('fs'),
    path = require('path');

exports.writeFile = writeFileRecursive;

var recursive_path = function (Path) {
    fys.mkdir(Path, function (err) {
        if (err) {
            if (err.errno == -4058 || err.errno == 34 && err.code != 'EEXIST') {
                recursive_path(path.dirname(Path));
                recursive_path(Path);
            }            
        }        
    })
}

var writeFileRecursive = function (Full_Path, data) {
    var f_path = path.dirname(Full_Path);
    fys.writeFile(Full_Path, data, function (err) {
        if (err) {
            if (err.errno == -4058 || err.errno == 34 && err.code == 'ENOENT') {
                recursive_path(f_path);
                writeFileRecursive(Full_Path, data);
            }
        } else { console.log(err); }        
    })
}
