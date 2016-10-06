(function(){

  angular
    .module('app',['ngMaterial'])
    .controller('myCtrl', AppController)
    .controller('waitCtrl', ['$mdDialog', '$rootScope', waitCtrl])
     .config(function($mdThemingProvider) {
               $mdThemingProvider.theme('customTheme') 
                  .primaryPalette('grey')
                  .accentPalette('orange')
                  .warnPalette('red');
               });

  angular.module('app').service('myutils', myutils);
    myutils.$inject = ['$mdDialog', '$rootScope'];

    
  function AppController($scope, $http, myutils) { 

    $scope.getData = function() {

      myutils.showWait(); //$mdDialog.show 並監聽hide_wait事件 (收到 $mdDialog.cancel)
      $scope.status = true;
      $scope.message = "Getting Data...";

      $http({
          method : "POST",
          url : "https://andruxnet-random-famous-quotes.p.mashape.com/",
          headers : {
           'X-Mashape-Key': "OivH71yd3tmshl9YKzFH7BTzBVRQp1RaKLajsnafgL2aPsfP9V",
           "Content-Type": "application/x-www-form-urlencoded",
           'Accept' : 'application/json'
          }
      }).then(function success(response) {
          console.log('success');
          $scope.message = "Data received : " + response.data.quote;
          myutils.hideWait(); //發送hide_wait事件
      }, function error(response) {
          console.log('fail');
          console.log(response.data.quote);
      });

      // setTimeout(function(){
      //   $scope.message = "Data received";
      //   myutils.hideWait();
      // },4000);
    
    };
  }

  function myutils($mdDialog, $rootScope) { 
     
     return {
       hideWait: hideWait,
       showWait: showWait
     }
     
     function hideWait(){
        setTimeout(function(){
            $rootScope.$emit("hide_wait"); 
          },5);
      }
      
     function showWait(){

          $mdDialog.show({
            controller: 'waitCtrl',
            templateUrl: 'dialog1.tmpl.html',
            parent: angular.element(document.body),
            clickOutsideToClose:false,
            fullscreen: false
          })
          .then(function(answer) {
            
          });
       }
  
  }

  function waitCtrl($mdDialog, $rootScope) {
      $rootScope.$on("hide_wait", function (event, args) {
            $mdDialog.cancel();
      }); 
  }

})();