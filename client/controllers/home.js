/**
  * @class chatterboxCtrl
  * @description Controller for chat. Makes use of databaseAndAuth factory in order to retrieve/update chat messages from the databse.
*/
angular.module('myApp').controller('home', function($scope, $rootScope, $location, socket, speech) {


  $scope.listen = function() {

    socket.runSocket();
  };

  $scope.stop = function() {

    socket.stopRecording();
  }

});