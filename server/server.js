var express = require('express'),
    app = express(),
    path = require('path'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    Schema = mongoose.Schema,
    http = require('http'),
    array = [],
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    GitHubStrategy = require('passport-github2').Strategy;

var GITHUB_CLIENT_ID = "fe21f1ad7bc9146e6015";
var GITHUB_CLIENT_SECRET = "cab8552b2ca3cc736b7c0a0fe2b49a672a38400d";


mongoose.connect('mongodb://Thlapath:codefeed@ds059672.mongolab.com:59672/recoddit', function(err){
  if(err){return err;}
  console.log("connected to Db");
});

var UserSchema = new Schema({
	email:{type: String , required:true , index: {unique: true}},
	username:{type: String, required:true, index: {unique: true}},
	password: {type: String, required: true},
	access_token: {type: String}
});

var PostSchema = new Schema({
	title: {type: String, required: true},
	url: {type: String, required: true},
	post: {type: String, required: true},
	// postedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
	comment: [{body: "string", by: mongoose.Schema.Types.ObjectId}]
});


// var CommentSchema = new Schema({
// 	comment: {type: String, required: true},
// 	date: {type: date, required: true},

// });

var User = mongoose.model("User", UserSchema);
var Post = mongoose.model("Post", PostSchema);
app.use(express.static('client'));
app.use(bodyParser.json());
app.use(cookieParser());
//Oauth info
app.use(passport.initialize());
app.use(passport.session());

//local login
passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if (!user.verifyPassword(password)) { return done(null, false); }
      return done(null, user);
    });
  }
));

app.post('/login',
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });


//github login
passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: "http://ancient-tundra-6889.herokuapp.com/"
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate({ githubId: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
));

passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (obj, done) {
  done(null, obj);
})

app.get('/auth/github',
  passport.authenticate('github', { scope: [ 'user:email' ] }));

app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });


app.post('/comment', function (req, res) {
  Post.findOneAndUpdate({_id: req.body.postId}, function(err,post){
  	if(err) throw err;
  	post.comment.push({
  		body: req.body.body,
  		by: req.body.username
  	});
  });
});


// middleware

app.get('/comments', function (req, res) {
	Post.find({_id: req.body.postId}, function(err, post){
		if(err) throw err;
		res.send(post.comment);
	});
});

app.post('/post', function (req, res) {
		var newpost = new Post({
				title: req.body.title,
				url: req.body.url,
				post: req.body.post
	//			postedBy: req.body.username
		});
		newpost.save(function(){
			res.status(200).end();
			console.log("saved a new post");
		});
	// console.log("Body: "+req.body);
	// if(!req.cookies.username){
	// 	console.log("Cookies don't exist: "+req.cookies.username);
	// 	//res.send('Please log in before posting');
	// 	res.error();
	// 	res.end();
	// } else {
	// 	console.log("Cookies exist: "+req.cookies.username);
	// 	User.find({username: req.cookies.username})
	// 		.then(function(user){
	// 			if(!user){
	// 				res.send('Please log in before posting');
	// 			}
	// 			else if(req.cookies.access_token !== user.usertoken){
	// 				console.log("Invalid token");
	// 				res.error();
	// 				res.end();
	// 			}
	// 			req.body.username = req.cookies.username;
	// 			console.log(req.body);
	// 			Post
	// 			  .create(req.body)
	// 			  .then(function(post){
	// 			  	res.send(post);
	// 			  	//res.send('post added');
	// 			  })
	// 			  .catch(function (error) {
	// 			    if (error) {
	// 			      res.send(error);
	// 			    }
	// 			  });
});


app.get('/posts', function (req, res) {
  Post.find({}, function(err,posts){
  	if(err) throw err;
  	console.log(posts);
  	res.send(posts);
  });
});

// app.get('/fb_users', function (req, res) {

// });

// app.post('/upvote', function (req, res) {

// });


app.listen(process.env.PORT || 3000);
