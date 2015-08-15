var global_settings = {} ;

var app = angular.module('MyAPP',['ngRoute']);

var ensureLoggedIN = function (httpElement, callback) {
	httpElement.get('/tutorial/getUser')
	.success(function(data){
		if (data.hasOwnProperty("IsActivated") && data.IsActivated ) {
			if (typeof callback === 'function') {
				callback(data);
			}
        }else{
          alert("You need an ACTIVE account to perform this task")
          window.location.replace("/login");
        }  
	})	
}

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
	ensureLoggedIN($http, function(data){
		$scope.user = data;
	});
}])

app.controller("admin",["$scope","$http",function($scope,$http){
	ensureLoggedIN($http);
}])

app.controller("announcement",["$scope","$http",function($scope,$http){
	ensureLoggedIN($http);
}])

app.controller("blogs",["$scope","$http",function($scope,$http){
	ensureLoggedIN($http);
}])

app.controller("upload",["$scope","$http",function($scope,$http){
	ensureLoggedIN($http);
}])

app.controller("member",["$scope","$http",function($scope,$http){
	ensureLoggedIN($http);
}])

app.controller('AlumniEditHomeController',['$scope','$http',function($scope,$http){
	ensureLoggedIN($http);
	$http.get("/data/get?form=alumni&units=-1").success(function(data){
		$scope.members = data;
		global_settings.file = $scope.members;
	}).error(function(err){console.log("readErr:"+err)});
}]);

app.controller('AlumniEditFullViewController',['$scope','$http','$routeParams',
	function($scope,$http,$routeParams){
		ensureLoggedIN($http);
	showMember = function(member){
		document.getElementsByName("alumni_update_main")[0].action = "/data/replace?form=alumni&id="+member._id ;
		document.getElementsByName("alumni_update_delete_entry")[0].action = "/data/delete?form=alumni&id="+member._id ; 
		document.getElementsByName('name')[0].value = member.name;
		document.getElementsByName('year')[0].value = member.year;
		document.getElementsByName('wentTo')[0].value = member.wentTo;
		document.getElementsByName('phone')[0].value = member.phone;
		document.getElementsByName('mail')[0].value = member.mail;
		document.getElementsByName('link')[0].value = member.link;
		document.getElementsByName('img')[0].value = member.img;
	}
	if (!global_settings.file) {alert("Nothing to change! \nGo back and select something")}
	else showMember(global_settings.file[$routeParams.id]);
	
}]);

app.controller('PeopleEditHomeController',['$scope','$http',function($scope,$http){
	ensureLoggedIN($http);
	$http.get("/data/get?form=member&units=-1").success(function(data){
		$scope.members = data;
		global_settings.file = $scope.members;
	}).error(function(err){console.log("readErr:"+err)});
}]);

app.controller('PeopleEditFullViewController',['$scope','$http','$routeParams',
	function($scope,$http,$routeParams){
		ensureLoggedIN($http);
	showMember = function(member){
		document.getElementsByName("people_update_main")[0].action = "/data/replace?form=member&id="+member._id ;
		document.getElementsByName("people_update_delete_entry")[0].action = "/data/delete?form=member&id="+member._id ; 
		document.getElementsByName('name')[0].value = member.name
		document.getElementsByName('link')[0].value = member.link;
		document.getElementsByName('img')[0].value = member.img;
	}
	if (!global_settings.file) {alert("Nothing to change! \nGo back and select something")}
	else showMember(global_settings.file[$routeParams.id]);
	
}]);