angular
  .module('app')
    .controller('PostController', PostController);
    HomeController.$inject =  ['$http'];

    function PostController($http) {
      this.post_msg = {};
      this.submit= function(){
        var that = this;
        $http.post('/post', that.post_msg).success(function(data,status) {
          // console.log(status);
          that.post_msg = {};
        });

      }
    }
