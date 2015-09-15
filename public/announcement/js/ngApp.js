//ng-App with routing
var app = angular.module('AnnouncementApp', ['ngRoute']); 
app.config(['$routeProvider', function ($routeProvider) {
	$routeProvider 
	.when('/fullView', 
		{controller: "HomeController", 
		templateUrl: "views/home.html"}) 
	.when('/fullView/:id', 
		{controller: 'fullViewController', 
		templateUrl: 'views/fullView.html'}) 
	.otherwise(
		{redirectTo: '/fullView'}); 
}]); 

//ng-controllers
app.controller('fullViewController', ['$scope', 'announcements_all', '$routeParams', 
	function($scope, announcements_all, $routeParams) 
	{announcements_all.success(function(data) 
		{$scope.announcement = data[$routeParams.id]; 
		}); 
}]); 
app.controller('HomeController', ['$scope', 'announcements_all', 
	function($scope, announcements_all) {
		announcements_all.success(function(data) {
			$scope.announcements = data; }); 
}]); 

//ng-service
app.factory('announcements_all', ['$http', function($http) 
	{return $http.get('/data/announcement?units=-1') 
	.success(function(data) {return data; }) 
	.error(function(data) {return data; }); 
}]); 