var app = angular.module('myApp',['ngRoute']);
app.config(['$routeProvider', function ($routeProvider) {
	$routeProvider 
	.when('/fullView', 
		{controller: "HomeController", 
		templateUrl: "views/home.html"}) 
	.when('/fullView/:id', 
		{controller: 'fullViewController', 
		templateUrl: 'views/fullview.html'}) 
	.otherwise(
		{redirectTo: '/fullView'}); 
}]); 

var FileObj; //global aaray to store input File
var filePath = '/shared/data/members.json',
relFilePath = '../../shared/data/members.json';

var radid = 'rad1',
base64Stream = "";

var handleFileSelect = function(evt) {
	console.log('new file selected');
    var files = evt.target.files;
    var file = files[0];

    if (files && file) {
        var reader = new FileReader();

        reader.onload = function(readerEvt) {
            var binaryString = readerEvt.target.result;
            base64Stream = btoa(binaryString);
        };

        reader.readAsBinaryString(file);
    }
};

var postPicObj = {
		target : "",
		key : "",
		base64Stream : ""
},
IsNewPic = false;

var	insertnewpicture = function(DATA, KEY, name){
	name = "/usr/images/"+name+"_"+Math.floor(Math.random()*100)+".jpg";
	name = name.replace(/\s+/g, '_');
	console.log("image renamed and given path: "+name);
	postPicObj.target = name;
	postPicObj.key = KEY;
	postPicObj.base64Stream = DATA;
	return name;
},
showMember = function(member){
	document.getElementById('name').value = member.name
	document.getElementById('link').value = member.link;
	document.getElementById('img-link').value = member.img;
},
seeforImg = function(){
	if (radid=='rad1') {
		IsNewPic=false;
		return document.getElementById('img-link').value;
	} else{
		IsNewPic=true;
		return insertnewpicture(base64Stream,document.getElementById('key').value,document.getElementById('name').value);
	};
}
var fetchChangedValues = function(){
	return	{ 	name : document.getElementById('name').value,
				link : document.getElementById('link').value,
				img  : seeforImg()
		    }
}
app.controller('HomeController',['$scope','$http',function($scope,$http){
	//fetch the file;
	$http.get(relFilePath).success(function(data){
		$scope.members = data;
		FileObj = $scope.members;
	}).error(function(err){console.log("readErr:"+err)});
}]);
app.controller('fullViewController',['$scope','$http','$routeParams',
	function($scope,$http,$routeParams){
	showMember(FileObj[$routeParams.id]);
	$scope.retMsg = '';
	$scope.post = function(){
		FileObj[$routeParams.id] = fetchChangedValues();
		if (IsNewPic) {
			$http.post('/inbound/newFile', postPicObj)
			.success(function(data){
				console.log("Img_post response : "+data);
			})
			.error(function(data){
					console.log("Img_post response : "+data);
				});
			};
		var encodedFileObj = {
		target : filePath,
		key : document.getElementById('key').value,
		fileObj : FileObj
		}		
		$http.post('/inbound/modify',encodedFileObj).success(function(data){
			$scope.retMsg = data;
		}).error(function(err){retMsg=err;console.log(err)});
	}
	$scope.del = function(){
		document.getElementById('btnDel').disabled=true;
		FileObj.splice($routeParams.id,1);
		var encodedFileObj = {
		target : filePath,
		key : document.getElementById('key').value,
		fileObj : FileObj
		}
		$http.post('/inbound/modify',encodedFileObj).success(function(data){
			$scope.retMsg = data;
		}).error(function(err){retMsg=err;console.log(err)});
	}
}]);