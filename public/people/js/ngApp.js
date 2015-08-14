var app = angular.module('peopleApp', []); 

//ng-controllers 
app.controller('HomeController', ['$scope', 'people_current', 
	function($scope, people_current) {
		people_current.success(function(data) {
			$scope.members = data; }); 
}]); 

//ng-service
app.factory('people_current', ['$http', function($http) 
	{return $http.get('/data/get?form=member&units=-1') 
	.success(function(data) {return data; }) 
	.error(function(data) {return data; }); 
}]); 
