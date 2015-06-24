var app = angular.module('uploadApp', []);

var postDataMsg = {
	target : "",
	key : "",
	base64Stream : ""
};
var createPath = function(){
	postDataMsg.key = document.getElementById('key').value;
	postDataMsg.target = document.getElementById('target').value;
}

var handleFileSelect = function(evt) {
    var files = evt.target.files;
    var file = files[0];

    if (files && file) {
        var reader = new FileReader();

        reader.onload = function(readerEvt) {
            var binaryString = readerEvt.target.result;
            postDataMsg.base64Stream = btoa(binaryString);
        };

        reader.readAsBinaryString(file);
    }
};

if (window.File && window.FileReader && window.FileList && window.Blob) {
    document.getElementById('filePicker').addEventListener('change', handleFileSelect, false);
} else {
    alert('The File APIs are not fully supported in this browser.');
}

app.controller('msgSubmit',['$scope','$http',function($scope, $http){

		$scope.retMsg = "";
		$scope.post = function(){
			createPath();
			console.log(postDataMsg);
			$http.post('/inbound/newFile', postDataMsg)
			.success(function(data){
					$scope.retMsg = data;
				})
			.error(function(data){
					$scope.retMsg = data;
				});
		};		
}]);
