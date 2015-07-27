var User = require('./db_user_model.js');
exports.changePass = function (request, response) {
	User.findById(request.user.id, function(err, user) {
        	if(err) {console.error("Error:user find by id\n"+err)}
        	if (user) {
        		user.password = user.generateHash(request.body.password);
        		user.save(function(err){
        			if(err){console.error("Error: password change resave\n"+err);}
        			else response.send("password successfully changed !");
        		})
        	};
        });
}