var app = angular.module('linkGeneratorApp', []);

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
	type : 'post',
	update : true,
	author : '',
	title : '',
	link : '',
	key : '',
	img : ''
};
var parse = function(){
			postDataMsg.author = document.getElementById('from').value;
			postDataMsg.title = document.getElementById('title').value;
			postDataMsg.link = document.getElementById('link').value;
			if (radid=='rad1') {
				postDataMsg.img = document.getElementById('img-link').value;
			} else{
				postDataMsg.img = "data:image/png;base64,"+base64Stream;
			};
			postDataMsg.key = document.getElementById('key').value
		}

app.controller('msgSubmit',['$scope','$http',function($scope, $http){

		$scope.retMsg = "";
		$scope.post = function(){
			parse();
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
