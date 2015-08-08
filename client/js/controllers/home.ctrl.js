angular
  .module('app')
    .controller('HomeController', HomeController);
    // this sets the alias for home controller as "HomeController"
    HomeController.$inject =  ['$http'];
     
     function HomeController($http) {
      var self = this;
      this.post = {};
      

     
     this.posted  = [];

      this.submit = function () {
        console.log("post is running");
        console.log(this.post);

        $http.post('/post', this.post).success(function(data) {
          self.posted.push(data);
        });
      
      this.post = {};
      };

      $http.get('/posts').success(function(data){
        // console.log(data);
        // console.log("this", this);
        // console.log("self", self);
        self.posted = self.posted.concat(data);
      });

      //allPosts;
      console.log("we are accesing posts properly");
    }