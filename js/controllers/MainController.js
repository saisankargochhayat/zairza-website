app.controller('Preview_Controller', 
               ['$scope',function($scope){
/*Append new notices in the end of the $scope.notice */
                $scope.notice = [{
                                  heading : 'Contribute to this Project!',
                                  body : 'You can fork this project on git hub !'
                                },
                                {
                                  heading : 'Content creation',
                                  body : 'New contents can be created by modifying \"js/controller/MainController\" and adding json values.'
                                },
                                {
                                  heading : 'Classes for new session',
                                  body: 'Classes for new session to be started soon.'
                                }];

                $scope.post = [{
                                heading : 'How to use search',
                                img : 'images/shubham.jpg',
                                link : '#'
                              },
                              {
                                heading : 'Introduction to HTML',
                                img : 'images/jon.png',
                                link : '#'
                              }];

                $scope.openInfo = function(info) {    
                openInfo(info);             
                };
 
               }]);

app.controller('footer', 
               ['$scope',function($scope){
                $scope.date = new Date();
               }]);

app.controller('MainController', 
               ['$scope',function($scope){}]);