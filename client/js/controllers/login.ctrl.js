angular
 .module('app')
 .controller('LoginController', LoginController)
 .service("$login", function() {
   this.loggedIn = false;
 });
LoginController.$inject = ['$scope', '$http', '$login', '$location'];

function LoginController($scope, $http, $login, $location) {
 this.user = {}

 this.ghLogin = function() {
   console.log('logging in');
   $location.path('/auth/github');
 }
}
