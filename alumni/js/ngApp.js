var app = angular.module('ngApp', []); 

//ng-controllers 
app.controller('HomeController', ['$scope', 'fetch', 
	function($scope, fetch) {
		fetch.success(function(data) {
			$scope.members = data; }); 
}]); 

//ng-service
app.factory('fetch', ['$http', function($http) 
	{return $http.get('./../shared/data/alumni.json') 
	.success(function(data) {return data; }) 
	.error(function(data) {return data; }); 
}]); 
