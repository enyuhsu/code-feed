angular
  .module('app')
    .controller('PostController', PostController);
    HomeController.$inject =  ['$http'];

    function PostController($http) {
      var temp = {};
      this.submit= function(){
        var that = this;
      $http.post('/post', this.temp).success(function(data) {
        console.log(data);
      });

      }
    }
