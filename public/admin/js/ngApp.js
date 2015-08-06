var global_settings = {} ;

var app = angular.module('MyAPP',['ngRoute']);

app.config(['$routeProvider', function ($routeProvider) {
	$routeProvider
	.when('/profile',{
		controller: "profile", 
		templateUrl: "views/profile.html"}) 
	.when('/alumni',{
		controller: "admin", 
		templateUrl: "views/alumni.html"})
	.when('/announcement',{
		controller: "admin", 
		templateUrl: "views/announcement.html"})
	.when('/blogs',{
		controller: "blogs", 
		templateUrl: "views/blogs.html"})
	.when('/member',{
		controller: "member", 
		templateUrl: "views/member.html"})
	.when('/upload',{
		controller: "upload", 
		templateUrl: "views/upload.html"})

	//alumnimod
	.when('/AlumniEditFullView', 
		{controller: "AlumniEditHomeController", 
		templateUrl: "views/AlumniEditHome.html"}) 
	.when('/AlumniEditFullView/:id', 
		{controller: 'AlumniEditFullViewController', 
		templateUrl: 'views/AlumniEditFullview.html'}) 

	//peoplemod
	.when('/PeopleEditFullView', 
		{controller: "PeopleEditHomeController", 
		templateUrl: "views/PeopleEditHome.html"}) 
	.when('/PeopleEditFullView/:id', 
		{controller: 'PeopleEditFullViewController', 
		templateUrl: 'views/PeopleEditFullview.html'})

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

app.controller('AlumniEditHomeController',['$scope','$http',function($scope,$http){
	$http.get(relFilePath).success(function(data){
		$scope.members = data;
		global_settings.file = $scope.members;
	}).error(function(err){console.log("readErr:"+err)});
}]);

app.controller('AlumniEditFullViewController',['$scope','$http','$routeParams',
	function($scope,$http,$routeParams){

	showMember = function(member){
		document.getElementById('name').value = member.name;
		document.getElementById('year').value = member.year;
		document.getElementById('wentTo').value = member.wentTo;
		document.getElementById('phone').value = member.phone;
		document.getElementById('mail').value = member.mail;
		document.getElementById('link').value = member.link;
		document.getElementById('img-link').value = member.img;
	}
	if (!global_settings.file) {alert("Nothing to change! \nGo back and select something")}
	else showMember(global_settings.file[$routeParams.id]);
	
}]);

app.controller('PeopleEditHomeController',['$scope','$http',function($scope,$http){
	$http.get(relFilePath).success(function(data){
		$scope.members = data;
		global_settings.file = $scope.members;
	}).error(function(err){console.log("readErr:"+err)});
}]);

app.controller('PeopleEditFullViewController',['$scope','$http','$routeParams',
	function($scope,$http,$routeParams){

	showMember = function(member){
		document.getElementById('name').value = member.name
		document.getElementById('link').value = member.link;
		document.getElementById('img-link').value = member.img;
	}
	if (!global_settings.file) {alert("Nothing to change! \nGo back and select something")}
	else showMember(global_settings.file[$routeParams.id]);
	
}]);