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
        // console.log(data);
      });

      // this.submit = function () {

      // $http.post('/post', this.post).success(function(data) {
      //     self.posted.push(data);
      //   });
      //   this.post = {};
      // };

      // this.upcounter = 0;
      // this.onlyOne = false;
      // this.upVote = function () {

      //   if (this.onlyOne === false) {
      //     this.upcounter++;
      //     this.onlyOne = true;
      //   }
      //   else {
      //     this.upcounter--;
      //     this.onlyOne = false;
      //   }

      //   console.log(this.onlyOne);
      //   $http.post('/vote', {counter: this.upcounter}).success(function (data) {
      //     console.log('click');

      //   });
      // };

      // this.downcounter = 0;
      // this.downonlyOne = false;
      // this.downVote = function () {

      //   if (this.downonlyOne === false) {
      //     this.downcounter--;
      //     this.downonlyOne = true;
      //   }
      //   else {
      //     this.downcounter++;
      //     this.downonlyOne = false;
      //   }

      //   console.log(this.downonlyOne);
      //   $http.post('/vote', {counter: this.downcounter}).success(function (data) {
      //     console.log('click');

      //   });
      // };

    }
