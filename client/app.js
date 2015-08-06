angular
  .module('app', [
    'ui.router'
    ])

.config(function($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: 'partials/home.html',
            controller: 'HomeController',
            controllerAs: 'homeCtrl'
        })
        .state('oauth', {
            url: '/oauth',
            templateUrl: 'partials/login.html',
            controller: 'LoginController',
            controllerAs: 'loginCtrl'
        });
});