angular
  .module('app')
    .controller('CommentController', CommentController);

    CommentController.$inject =  ['$http'];

    function CommentController($http) {
      var that = this;
      this.comment = {};
      this.allComments = []

      $http.get('/comments').success(function(data, status){
        console.log(data);
        that.allComments = allComments.concat(data); //should join all comments into one single array?
      });

      this.userComment = function(){
        $http.post('/comments',this.comment).success(function(data,status){
          that.comment = {};//clears the iput boxes
          that.allComments.push(data);//newest post should immediatly be displated in the page
        });
      }
    }
