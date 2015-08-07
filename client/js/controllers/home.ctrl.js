angular
  .module('app')
    .controller('HomeController', HomeController);
    // this sets the alias for home controller as "HomeController"
    HomeController.$inject =  ['$http'];

    function HomeController($http) {

      this.posts = [
      {title:"Title1", url:"http://www.google.com"},
      {title:"Title1", url:"Url1"},
      {title:"Title1", url:"Url1"},
      {title:"Title1", url:"Url1"},
      {title:"Title1", url:"Url1"},
      {title:"Title1", url:"Url1"},
      {title:"Title1", url:"Url1"},
      {title:"Title1", url:"Url1"},
      {title:"Title1", url:"Url1"},
      {title:"Title1", url:"Url1"},
      {title:"Title1", url:"Url1"},
      {title:"Title1", url:"Url1"},
      {title:"Title1", url:"Url1"}]

      //allPosts;
      console.log("we are accesing posts properly");
    }