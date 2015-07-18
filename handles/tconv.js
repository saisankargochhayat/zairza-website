//Simple logicless object-string replacer 
//because ejs.render was not working for me

module.exports = function (str,obj,separater){
 	var strarr = str.split(separater);
 	for (var i = 0; i < str.length; i++) {
 		if(obj.hasOwnProperty(strarr[i])){
 			strarr[i] = obj[strarr[i]];
 		}
 	};
 	return strarr.join('');
 }
