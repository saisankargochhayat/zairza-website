var app = angular.module("ngApp",["ng-Route"]);

app.config(["$routeProvider",function ($routeProvider) {
  $routeProvider
  .when("/index",{
    controller : "mainController",
    templateUrl: "/views/main.html"
  })
  .when("/display/:id",{
    controller : "display",
    templateUrl: "/views/display.html"
  })
  .when("/editor/:id",{
    controller : "editor",
    templateUrl: "/views/editor.html"
  })
  .when("/tag/:id",{
    controller : "tag",
    templateUrl: "/views/tagsearch.html"
  })
  .otherwise(
    {redirectTo: '/index'}); 
}])


app.controller("mainController",['$scope','$http','$routeParams', 
  function($scope, $http, $routeParams){
    $scope.getJournal = function(typename){
      $http.get("/tutorial/getJournal?typename="+typename)
      .success(function(data){
        return data;
      })
      .error(function(err){
        console.log(err);
        return [];
      })  
    }
  }]);

app.controller("display",['$scope','$http','$routeParams',
  function($scope, $http, $routeParams){

  }]);

app.controller("editor",['$scope','$http','$routeParams',
  function($scope, $http, $routeParams){

  }])