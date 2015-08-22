angular
  .module('app')
  .controller('CommentController', CommentController);

CommentController.$inject = ['$http', '$location', '$stateParams'];

function CommentController($http, $location, $stateParams) {
  this.newComment = "";
  var that = this;

  this.post_msg = {
    title: "",
    url: "",
    post: "",
    comment: [],
    likes: 0,
    dislikes: 0
  };
  $http.post('/comments', {
    postId: $stateParams.postId
  }).success(function(data) {

    that.post_msg = data;
    // console.log("post comments"+that.likes);
  });

  this.userComment = function() {
    // console.log("here");
    $http.post('/comment', {
      postId: $stateParams.postId,
      comment: this.newComment
    }).success(function(data, status) {
      // console.log("comment saved");
      that.post_msg.comment.unshift({
        body: that.newComment,
        by: ""
      }); //newest post should immediatly be displated in the page
      that.newComment = ""; //clears the iput boxes
    });
  }


  this.upvote = function() {
      this.upVotes++;
    $http.put('/likes', {
      postId: $stateParams.postId,
      likes: that.post_msg.likes
    }).success(function(data, status){
      console.log(that.upVotes);

    });
  }

  this.downvote = function() {
    this.downVotes++;
    $http.put('/dislikes', {
      postId: $stateParams.postId,
      dislikes: that.post_msg.dislikes
    }).success(function(data, status){

    });
  }
}
