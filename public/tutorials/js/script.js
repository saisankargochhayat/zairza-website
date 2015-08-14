var global_settings = {type:null} ;

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
  .when("/newpage",{
    controller : "newpage",
    templateUrl: "./views/editor.html"
  })
  .when("/tag/:tagname",{
    controller : "tag",
    templateUrl: "./views/tagsearch.html"
  })
  .when("/Search/:tagname",{
    controller : "Search",
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
    $scope.submitData = function(){
      var a = document.getElementById('search').value ;
      window.location.href = "/tutorials/#/Search/"+a;
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

app.controller("Search",['$scope','$http','$routeParams',
  function($scope, $http, $routeParams){
    var tagname = $routeParams.tagname;
    $scope.tag = tagname;
    $scope.pageMatch = [];
    $http.get("/tutorial/searchAllPages?tagname="+tagname)
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
    $scope.user = {};
    $http.get("/tutorial/getUser")
      .success(function(data){
        if (data.hasOwnProperty("name")) {
          $scope.user = data;
          global_settings.user = data;  

          //retrive page
          var fileid = $routeParams.id;
          $http.get("/tutorial/getPageById?id="+fileid)
          .success(function(data){
            //update data on window
            global_settings.type = "edit";
            config_editor_view(data);
          })
          .error(function(err){
            console.log(err);
          })
        }else{
          alert("You need to login to perform this task")
          window.location.replace("/login");
        }        
      })
      .error(function(err){
        console.log(err);
      })
  }])

app.controller("newpage",['$scope','$http','$routeParams',
  function($scope, $http, $routeParams){
    //verify if access available
    $scope.user = {};
    $http.get("/tutorial/getUser")
      .success(function(data){
        if (data.hasOwnProperty("name")) {
          $scope.user = data;
          //update window
          global_settings.user = data;  
          global_settings.type = "new";
          config_editor_view();
        }else{
          alert("You need to login to perform this task")
          window.location.replace("/login");
        }        
      })
      .error(function(err){
        console.log(err);
      })
  }])

app.filter('htmlToPlaintext', function() {
    return function(text) {
      return String(text).replace(/<[^>]+>/gm,'').split("&nbsp;").join(" ");
    };
  })

app.filter('previewText', function() {
    return function(text) {
      return String(text).substring(0,250) + "...";
    };
  })


var config_editor_view = function(page){
  // JavaScript source code
jQuery(document).ready(function ($) {
    CKEDITOR.config.disableNativeSpellChecker = false;
    CKEDITOR.config.removeButtons = 'Source';
    CKEDITOR.config.filebrowserUploadUrl= '/tutorial/imageUpload';
    CKEDITOR.config.extraPlugins = 'mediaembed';
});

    $( "#Title, #Contrib, #mainBody" ).click(function(){
      $(this).prop( "contenteditable", true );
      $(this).ckeditor();
    })
    //BUG: file no. generation based on time may lead to race condition
    var f = new Date().getTime().toString();
    var creater_id = global_settings.user.id;
    //dropdown menu selector
    var menuSelected='1',
        menuShortName = 'manual',
        menuFullName = 'Robotics|Manual';

    // If edit then ...
    //while(! global_settings.hasOwnProperty("edit"));

    if (global_settings.type == "edit") {
        f = page.fileid ;
        creater_id = page.__creater_id; 
        menuShortName = page.savePosition;
        menuFullName = page.placement;
        $('#Title').html(page.title);
        $('#Contrib').html(page.contributers);
        $('#mainBody').html(page.mainbody);
        $('#Tags').val(page.tagfield.join(","))
    }

    $('#fileId').append(f);
    var setMenu = function(mfullname){
        $('#selectedTarget').empty();
        $('#selectedTarget').append(mfullname);
    }                        
    setMenu(menuFullName);
    $('.dept').click(function(){
        menuSelected = this.id;
        switch(menuSelected){
            case '1' : menuShortName='manual' ; menuFullName='Robotics|Manual';
            break;
            case '2' : menuShortName='electronics' ; menuFullName='Robotics|Electronics';
            break;
            case '3' : menuShortName='avr' ; menuFullName='Robotics|Avr';
            break;
            case '4' : menuShortName='arduino' ; menuFullName='Robotics|Arduino';
            break;
            case '5' : menuShortName='misc_robotics' ; menuFullName='Robotics|Miscellaneous';
            break;
            case '6' : menuShortName='web' ; menuFullName='Software|Web Development';
            break;
            case '7' : menuShortName='languages' ; menuFullName='Software|Languages';
            break;
            case '8' : menuShortName='standalone' ; menuFullName='Software|Standalone Apps';
            break;
            case '9' : menuShortName='misc_software' ; menuFullName='Software|Everything Else';
            break;
            case '10' : menuShortName='sae' ; menuFullName='Automobile|SAE';
            break;
            case '11' : menuShortName='asme' ; menuFullName='Automobile|ASME';
            break;
            case '12' : menuShortName='misc_automobile' ; menuFullName='Automobile|Miscellaneous';
            break;
        }
        setMenu(menuFullName);
    })
    /*fading out warning, status bar other stuffs*/
    $('.frclose').click(function () {
        var par = $(this).parent();
        var gpar = $(par[0]).parent();
        $(gpar[0]).fadeOut();
    });

    var processGist = function(htmlString){
        return htmlString.split(/<p>\s*&lt;\s*gist\s*id=\\/).join('<gist id=')
                .split(/\\\"&gt;&lt;\/gist&gt;<br><\/p>/).join('"></gist>')
                .split('<p>&lt;iframe').join('<iframe')
                .split('&gt;&lt;/iframe&gt;<br></p>').join('></iframe>');
    }

    $('#uploadToServer').click(function () {
        var uploadObj = {
            type:global_settings.type,
            __creater_id : creater_id,
            fileid: f,
            placement: menuFullName,
            savePosition:menuShortName,
            title : $('#Title').html(),
            contributers : $('#Contrib').html(),
            mainbody : processGist($('#mainBody').html()),
            tagfield : $('#Tags').val()
        }
        var upstr = JSON.stringify(uploadObj);
        console.log(upstr);
        $.post('/tutorial/newpage',uploadObj, function (data) {
            alert(data);
        })
        .success(function(){window.location.replace("/tutorials/#/display/"+f)})
        .error(function(){console.log('error')})
    })
} 