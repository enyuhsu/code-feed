angular
  .module('app')
    .controller('HomeController', HomeController);
    // this sets the alias for home controller as "HomeController"
    HomeController.$inject =  ['$http'];

    function HomeController($http) {
      var self = this;
      this.posts = [];

      $http.get('/posts').success(function(data){
        self.posts = data;
        console.log(data);
      });
    }
