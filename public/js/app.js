var app = angular.module("myApp",[]);

app.controller('Preview_Controller',['$scope','announncement_recent','posts_recent',
	function($scope, announncement_recent, posts_recent){
        announncement_recent.success(
        	function(data){
        		$scope.notice = data;
        	});
    	posts_recent.success(
        	function(data){
        		$scope.post = data;
        	}); 
    	/*openInfo helps jquery to show dialog box*/
    	$scope.openInfo = function(info) {    
    	openInfo(info);             
     	}; 
}]);

app.controller('footer', 
               ['$scope',function($scope){
                $scope.date = new Date();
               }]);

app.filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
});

app.factory('announncement_recent',['$http',function($http){
	return $http.get('/data/get?form=announcement&units=4')
	.success(function(data){return data;})
	.error(function(err){return err});
}]);
app.factory('posts_recent',['$http',function($http){
	return $http.get('/data/get?form=blog&units=4')
	.success(function(data){return data;})
	.error(function(err){return err});
}]);
