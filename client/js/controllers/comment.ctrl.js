angular
  .module('app')
    .controller('CommentController', CommentController);
    
    CommentController.$inject =  ['$http'];
     
     function CommentController($http) {
     var self = this;
     this.comment = {};
	 this.commented  = [];


     this.userComment = function(){

        $http.post('/comment',this.comment).success(function(data){
        self.commented.push(data);	
        });
        this.comment ={};
      }	

	 $http.get('/com').success(function(data){
      console.log(data);
        self.commented = self.commented.concat(data);
      });
     }