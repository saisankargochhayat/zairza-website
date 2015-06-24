var app = angular.module('msgFormApp', []);

var postDataMsg = {
	type : 'announce',
	update : true,
	from : '',
	datetime : '',
	title : '',
	body : '',
	key : '',
	img : ''
};
var parse = function(){
			postDataMsg.from = document.getElementById('from').value;
			postDataMsg.datetime = new Date(document.getElementById('date').value);
			postDataMsg.title = document.getElementById('title').value;
			postDataMsg.body = document.getElementById('body').value;
			postDataMsg.key = document.getElementById('key').value;
			postDataMsg.img = document.getElementById('img').value;
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
