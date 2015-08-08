angular
  .module('app')
    .controller('LoginController', LoginController);
    LoginController.$inject =  ['$scope','$http', '$state'];

    function LoginController($scope, $http, $state) {
    	this.user={};
    	var _this=this;
    	//this is called with results from FB.getLoginStatus
    	function statusChangeCallback(response) {
    		console.log('statusChangeCallback');

    		if(response.status === 'connected') {
    			_this.user.usertoken = response.authResponse.accessToken;
    			document.cookie = "access_token="+_this.user.usertoken;
    			FB.api('/me', function(response){
    				_this.user.username = response.name;
    				document.cookie = "username="+response.name;
    				console.log("oauth: Posting user update to database");
    				$http.post('fb_login',_this.user);
    				testAPI();
    			});
    		}
    		else if (response.status === 'not_authorized') {
    			//Logged into fb but not your app
    			//document.getElementById('status').innerHTML = 'Please log into the app.';
    		}
    		else {
    			//document.getElementById('status').innerHTML = 'Please log into Facebook.';
    		}

    	}

    	this.checkLoginState = function() {
    		$scope.$digest();
    		console.log("in checkLoginState");
    		FB.getLoginStatus(function(response) {
    			statusChangeCallback(response);
    		});
    	};

    	// init Javascript SDK
    	window.fbAsyncInit = function() {
    	    FB.init({
    	      appId      : '1448371758805147',
    	      xfbml      : true,
    	      version    : 'v2.4'
    	    });
    	    console.log("init js sdk");

    	    //now that it's init'd, we call FB.getLoginStatus()
    	    FB.getLoginStatus(function(response){
    	    	statusChangeCallback(response);
    	    });
    	  };

    	//Load SDK asynchronously
    	(function(d, s, id){
    	   var js, fjs = d.getElementsByTagName(s)[0];
    	   if (d.getElementById(id)) {return;}
    	   js = d.createElement(s); js.id = id;
    	   //connects to the SDK
    	   js.src = "//connect.facebook.net/en_US/sdk.js";
    	   fjs.parentNode.insertBefore(js, fjs);
    	 }(document, 'script', 'facebook-jssdk'));

    	//simple test of GraphAPI after login success
    	function testAPI() {
    		console.log('Welcome!');
    		FB.api('/me', function(response){
    			console.log(response);
    			console.log('Successful login for: '+response.name);
    			document.getElementById('status').innerHTML = 'Thanks for logging in, ' + response.name + '!';
    		});
    	}

    	//not being called
    	this.logout = function(){
    		console.log("Logged out");
    			document.getElementById('status').innerHTML = 'Logged out';
    			document.cookies="access_token=;username=;";
    			FB.logout();
    	};
      
    }

