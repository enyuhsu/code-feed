angular
  .module('app')
    .controller('HomeController', HomeController);
    // this sets the alias for home controller as "HomeController"
    HomeController.$inject =  ['$http'];
     
     function HomeController($http) {
      var self = this;
      this.post = {};
      this.posted  = [];
      console.log(this);

      this.submit = function () {
        console.log("post is running");
        
        //console.log(document.cookie);
        $http.post('/post', this.post).success(function(data) {
          self.posted.push(data);
        });
        this.post = {};
      };

      $http.get('/posts').success(function(data){
        
        // console.log("this", this);
        // console.log("self", self);
        self.posted = self.posted.concat(data);
      });

      

      this.counter = 0;
      this.onlyOne = false;
      this.upVote = function () {
        
        if (this.onlyOne === false) {
          this.counter++;
          this.onlyOne = true;
        } else {
          this.counter--;
          this.onlyOne = false;
        }
        
        console.log(this.onlyOne);
        $http.post('/upvote', {counter: this.counter}).success(function (data) {
          console.log('click');
          
        });
      };

    }