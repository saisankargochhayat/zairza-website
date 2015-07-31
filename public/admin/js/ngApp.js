var app = angular.module('MyAPP',['ngRoute']);

app.config(['$routeProvider', function ($routeProvider) {
	$routeProvider
	.when('/profile',{
		controller: "profile", 
		templateUrl: "view/profile.html"}) 
	.when('/alumni',{
		controller: "admin", 
		templateUrl: "view/alumni.html"})
	.when('/announcement',{
		controller: "admin", 
		templateUrl: "view/announcement.html"})
	.when('/blogs',{
		controller: "blogs", 
		templateUrl: "view/blogs.html"})
	.when('/member',{
		controller: "member", 
		templateUrl: "view/member.html"})
	.when('/upload',{
		controller: "upload", 
		templateUrl: "view/upload.html"})     
	.otherwise(
		{redirectTo: '/profile'}); 
}]);

app.controller("profile",["$scope","$http",function($scope, $http){
	$scope.user = {};
	$http.get('/tutorial/getUser')
	.success(function(data){
		$scope.user = data;
	})
}])

app.controller("admin",["$scope",function($scope){

}])

app.controller("announcement",["$scope",function($scope){
	
}])

app.controller("blogs",["$scope",function($scope){
	
}])

app.controller("upload",["$scope",function($scope){
	
}])

app.controller("member",["$scope",function($scope){
	
}])