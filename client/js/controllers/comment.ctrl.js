angular
  .module('app')
    .controller('CommentController', CommentController);

    CommentController.$inject =  ['$http', '$location', '$stateParams'];

    function CommentController($http, $location, $stateParams) {
      var that = this;
      this.post_msg = {title: "", url: "", post: "", comment: []};
      this.newComment = "";

      $http.post('/comments', {postId: $stateParams.postId}).success(function(data) {
        that.post_msg = data;
      });



      // $http.get('/comments').success(function(data, status){
      //   console.log(data);
      //   that.allComments = allComments.concat(data); //should join all comments into one single array?
      // });

      this.userComment = function() {
        console.log("here");
        $http.post('/comment', {postId: $stateParams.postId, comment: this.newComment}).success(function(data,status){
          console.log("comment saved");
          that.post_msg.comment.unshift({body: that.newComment, by: ""});//newest post should immediatly be displated in the page
          that.newComment = "";//clears the iput boxes
        });
      }
    }
