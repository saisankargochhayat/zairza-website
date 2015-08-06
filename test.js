var dbModel = require("./routes/formData_model.js");
var fs = require("fs");

var getData = function(a,b){
    var form = a,
        units = parseInt(b);
    dbModel.collection[form].find(function(err, data){
        if (err) {
            console.log("Error reading all form data\n"+err)
        } else{
            if (units == -1) {
                console.log("data="+data)
                console.log(data);
            } else{
                console.log("data="+data)
                var temp_data = [];
                for (var i = 0; i < units; i++) {
                    temp_data.push(data.pop());
                }
                console.log("temp_data="+temp_data)
                console.log(JSON.stringify(temp_data));
            }
        }
    })
}


var InsertData = function (a, b) {
  var form = a ;
  //iterate through request to find required fields
  var data = {};
  var iArray = dbModel.expected_fields[form] ;
  for (var i in iArray){
    if (b.hasOwnProperty(iArray[i])) {
      //if found then copy that element to "data" object 
      data[iArray[i]] = b[iArray[i]] ; 
    };
  }
      var form_data = new dbModel.collection[form];
      //populate form_data with values in data 
      for(var i in data){
        form_data[data[i]] = data[i] 
      }
      //try saving this new data into database
      form_data.save(function(err){
        if (err) {
          console.log("Error saving new file\n"+err)
          //res.send(Script("Error, try again later"))
        }else{console.log("success")}
      })
}

var blog = {"author":"shubham","title":"qwertyu" ,"link":"/ozmendias" ,"img":"/qwertyuiop","img_src":"link"}

InsertData("blog",blog);
getData("blog",4);