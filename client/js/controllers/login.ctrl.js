angular
  .module('app')
    .controller('LoginController', LoginController)
    .service("$login", function(){
        this.loggedIn = false;
    });
    LoginController.$inject =  ['$scope','$http', '$login'];

    function LoginController($scope, $http, $login) {
    	this.user={}
    	//this.loggedIn;
    	this.SDKinit;
    	var _this=this;
    	this.loggedIn = $login.loggedIn;

    	//this is called with results from FB.getLoginStatus
    	function statusChangeCallback(response) {
    		console.log('statusChangeCallback');

    		if(response.status === 'connected') {
    			$login.loggedIn = true;
    			_this.loggedIn = true;
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
    			$login.loggedIn = false;
    			document.getElementById('status').innerHTML = 'Please log into the app.';
    		}
    		else {
    			console.log("statusChangeCallback set login false");
    			$login.loggedIn = false;
    			document.getElementById('status').innerHTML = 'Please log into Facebook.';
    		}
    	}

    	this.checkLoginState = function() {
    		$scope.$digest();
    		console.log("in checkLoginState");
    		FB.getLoginStatus(function(response) {
    			statusChangeCallback(response);
    		});
    	}

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
    	    _this.SDKinit = true;
    	  };

    	  if(this.SDKinit){
    	  	console.log("sdk has been init: getting login status");
    	  	FB.getLoginStatus(function(response){
    	    	statusChangeCallback(response);
    	    });
    	  }
    	  
    	  // if(FB !== undefined){
    	  // 	FB.getLoginStatus(function(response){
    	  //   	statusChangeCallback(response);
    	  //   });
    	  // }

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

    	this.login = function(){
    		FB.login(this.postLogin);
    		// FB.login(function(response){
    		// 	if(response.authResponse.status === "connected"){
    		// 		_this.loggedIn = true;
    		// 	}
    		// 	_this.postLogin();
    		// });
    		// FB.getLoginStatus(function(response){
    	 //    	statusChangeCallback(response);
    	 //    	//window.location.reload();
    	 //    });
    		//this.checkLoginState();
    	}

    	this.postLogin = function(){
    		console.log("postlogin");
    		window.location.reload();
    	}

    	this.logout = function(){
    		console.log("logout set false");
    		$login.loggedIn = false;
    		//console.log("Logged out");
    			document.getElementById('status').innerHTML = 'Logged out';
    			document.cookie="access_token=;username=;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    			FB.logout();
    			window.location.reload();
    	}

    	this.myFunc = function(){
    		console.log("FB login button calls controller function!");
    	}
      
    }

