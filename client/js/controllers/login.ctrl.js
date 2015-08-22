angular
  .module('app')
  .controller('LoginController', LoginController)
  .service("$login", function() {
    this.loggedIn = false;
  });
LoginController.$inject = ['$scope', '$http', '$login', '$location'];
function LoginController($scope, $http, $login, $location) {
  $scope.user = {};

  $scope.signUp = function() {
  	var that = this;
    $http.post('/signup', this.user).success(function(data){
    	console.log('signin that fuck up!');
    	this.user.email = "";
    	this.user.password = "";
    });
  }

  $scope.login = function() {
    $http.post('/login').success(function(){
       document.cookie= "access_token = "+data;
       that.user.email = '';
       that.user.password = '';
    });
  }
}
