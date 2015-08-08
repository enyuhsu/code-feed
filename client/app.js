

angular.module('app', ['ui.router'])
.config(function($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: 'partials/home.html',
            controller: 'HomeController',
            controllerAs: 'homeCtrl'
        });

    $stateProvider
        .state('comments', {
            url: '/comments',
            templateUrl: 'partials/comments.html',
            controller: 'CommentController',
            controllerAs: 'commentCtrl'
        });    
        
        


});



