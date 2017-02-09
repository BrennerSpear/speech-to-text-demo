angular.module('myApp').config(function($routeProvider, $locationProvider, $httpProvider) {

  $routeProvider
  .when('/', {
      templateUrl: '../../partials/index.html',
      controller: 'home',
  })

});
