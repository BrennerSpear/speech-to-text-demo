/**
  * @class chatterboxCtrl
  * @description Controller for chat. Makes use of databaseAndAuth factory in order to retrieve/update chat messages from the databse.
*/
angular.module('myApp').controller('homeCtrl', function($scope, $rootScope, $location, socket) {


  $scope.listen = function() {
    console.log('listening!');
  };

});