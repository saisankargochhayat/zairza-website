var app = angular.module('blogApp', []); 

//ng-controllers 
app.controller('HomeController', ['$scope', 'blogs_all', 
	function($scope, blogs_all) {
		blogs_all.success(function(data) {
			$scope.blogs = data; }); 
}]); 

//ng-service
app.factory('blogs_all', ['$http', function($http) 
	{return $http.get('./../shared/data/posts.all.json') 
	.success(function(data) {return data; }) 
	.error(function(data) {return data; }); 
}]); 
