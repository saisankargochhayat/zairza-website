var app = angular.module("ngApp",["ngRoute"]);

app.config(["$routeProvider",function ($routeProvider) {
  $routeProvider
  .when("/index",{
    controller : "mainController",
    templateUrl: "./views/main.html"
  })
  .when("/display/:id",{
    controller : "display",
    templateUrl: "./views/display.html"
  })
  .when("/editor/:id",{
    controller : "editor",
    templateUrl: "./views/editor.html"
  })
  .when("/tag/:tagname",{
    controller : "tag",
    templateUrl: "./views/tagsearch.html"
  })
  .otherwise(
    {redirectTo: '/index'}); 
}])


app.controller("mainController",['$scope','$http', 
  function($scope, $http){
    var temp_store = {};
    var getJournalfromdb = function(typename){
      temp_store[typename] = [];
      $http.get("/tutorial/getJournal?typename="+typename)
      .success(function(data){
          temp_store[typename] = data;
      })
      .error(function(err){
        console.log(err);
       })
    }
    $scope.getJournal = function(typename){
      if (temp_store.hasOwnProperty(typename)){
        return temp_store[typename];
      }else{
        getJournalfromdb(typename);
        return temp_store[typename];
      }
    }
  }]);

app.controller("display",['$scope','$http','$routeParams','$sce',
  function($scope, $http, $routeParams, $sce){
    var fileid = $routeParams.id;
    $scope.page = {};
    $scope.viewcount = "working..."
    $http.get("/tutorial/getPageById?id="+fileid)
      .success(function(data){
        $scope.page = data;
        $scope.page.contributers = 
          $sce.trustAsHtml($scope.page.contributers);
        $scope.page.title = 
          $sce.trustAsHtml($scope.page.title);
        $scope.page.mainbody = 
          $sce.trustAsHtml($scope.page.mainbody);
      })
      .error(function(err){
        console.log(err);
      })
    $http.get("/tutorial/getViews?pageid="+fileid)
      .success(function(data){
        $scope.viewcount = data;
      })
      .error(function(err){
        console.log(err);
      })
  }]);

app.controller("tag",['$scope','$http','$routeParams',
  function($scope, $http, $routeParams){
    var tagname = $routeParams.tagname;
    $scope.tag = tagname;
    $scope.pageMatch = [];
    $http.get("/tutorial/findPageByTagName?tagname="+tagname)
      .success(function(data){
        $scope.pageMatch = data;
      })
      .error(function(err){
        console.log(err);
      })
  }])

app.controller("editor",['$scope','$http','$routeParams',
  function($scope, $http, $routeParams){
    //verify if access available
    $scope.user = {name:"login first"};
    $http.get("/tutorial/getUser")
      .success(function(data){
        if (data.hasOwnProperty("name")) {
          $scope.user = data;  
        };        
      })
      .error(function(err){
        console.log(err);
      })
    $http.get("/tutorial/getUser")
      .success(function(data){
        if (data.hasOwnProperty("name")) {
          $scope.user = data;  
        };        
      })
      .error(function(err){
        console.log(err);
      })

      //retrive page
    var fileid = $routeParams.id;
     var page = {};
    $http.get("/tutorial/getPageById?id="+fileid)
      .success(function(data){
        page = data;
        angular.element('#Title').html(page.title);
        angular.element('#Contrib').html(page.contributers);
        angular.element('#mainBody').html(page.mainbody);
        angular.element('#Tags').html(page.tagfield);
      })
      .error(function(err){
        console.log(err);
      })

  }])

app.filter('htmlToPlaintext', function() {
    return function(text) {
      return String(text).replace(/<[^>]+>/gm,'');
    };
  })
