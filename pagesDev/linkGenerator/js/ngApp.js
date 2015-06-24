var app = angular.module('linkGeneratorApp', []);

var postDataMsg = {
	type : 'post',
	update : true,
	author : '',
	title : '',
	link : '',
	key : '',
	img : ''
};
var parse = function(){
			postDataMsg.author = document.getElementById('from').value;
			postDataMsg.title = document.getElementById('title').value;
			postDataMsg.link = document.getElementById('link').value;
			postDataMsg.img = document.getElementById('img').value;
			postDataMsg.key = document.getElementById('key').value
		}

app.controller('msgSubmit',['$scope','$http',function($scope, $http){

		$scope.retMsg = "";
		$scope.post = function(){
			parse();
			console.log(postDataMsg);
			$http.post('/inbound/update', postDataMsg)
			.success(function(data){
					$scope.retMsg = data;
				})
			.error(function(data){
					$scope.retMsg = data;
				});
		};		
}]);
