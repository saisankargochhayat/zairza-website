var app = angular.module('ngApp', []);

var radid = 'rad1',
base64Stream = "";

jQuery(document).ready(function($){
	$('#img-file').hide();
    $('input[type=radio]').click(function(){
    	radid = this.id;
       if (this.id == 'rad1') {
    	$('#img-link').show();
    	$('#img-file').hide();
    } else{
    	$('#img-link').hide();
    	$('#img-file').show();
    };
    });
});
var handleFileSelect = function(evt) {
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

if (window.File && window.FileReader && window.FileList && window.Blob) {
    document.getElementById('img-file').addEventListener('change', handleFileSelect, false);
} else {
    alert('The File APIs are not fully supported in this browser.');
};

var postDataMsg = {
	type : 'member',
	update : false,
	name : '',
	link : '',
	key : '',
	img : ''
},
postPicObj = {
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
}

var parse = function(){
			postDataMsg.name = document.getElementById('name').value;
			postDataMsg.link = document.getElementById('link').value;
			postDataMsg.key = document.getElementById('key').value
			if (radid=='rad1') {
				IsNewPic=false;
				postDataMsg.img = document.getElementById('img-link').value;
			} else{
				IsNewPic=true;
				postDataMsg.img = insertnewpicture(base64Stream,postDataMsg.key,postDataMsg.name);
			};
		}

app.controller('msgSubmit',['$scope','$http',function($scope, $http){

		$scope.retMsg = "";
		$scope.post = function(){
			parse();
			if (IsNewPic) {
				$http.post('/inbound/newFile', postPicObj)
			.success(function(data){
					console.log("Img_post response : "+data);
				})
			.error(function(data){
					console.log("Img_post response : "+data);
				});
			};
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
