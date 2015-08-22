//this is called with results from FB.getLoginStatus
function statusChangeCallback(response) {
	console.log('statusChangeCallback');
	var access_token = response.authResponse.accessToken;
	console.log(response);
	//console.log(access_token);

	if(response.status === 'connected') {
		//Logged into app and fb
		testAPI();
	}
	else if (response.status === 'not_authorized') {
		//Logged into fb but not your app
		document.getElementById('status').innerHTML = 'Please log into the app.';
	}
	else {
		document.getElementById('status').innerHTML = 'Please log into Facebook.';
	}

}

function checkLoginState() {
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

    FB.getLoginStatus(function(response){
    	statusChangeCallback(response);
    });
  };

//now that it's init'd, we call FB.getLoginStatus()

// FB.getLoginStatus(function(response){
// 	statusChangeCallback(response);
// });

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

