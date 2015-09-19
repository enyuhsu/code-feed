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


mongoose.connect('mongodb://Thlapath:codefeed@ds059672.mongolab.com:59672/recoddit', function(err) {
  if (err) {
    return err;
  }
  console.log("connected to Db");
});

app.get('/post', function(req, res) {
    res.sendFile(path.join(__dirname, '/../client/index.html'));
});
app.get('/oauth', function(req, res) {
    res.sendFile(path.join(__dirname, '/../client/index.html'));
});
app.get('/comments/*', function(req, res) {
    res.sendFile(path.join(__dirname, '/../client/index.html'));
});
var UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    index: {
      unique: true
    }
  },
  username: {
    type: String,
    required: true,
    index: {
      unique: true
    }
  },
  password: {
    type: String,
    required: true
  },
  access_token: {
    type: String
  }
});

var PostSchema = new Schema({
	title: {type: String, required: true},
	url: {type: String, required: true},
	post: {type: String, required: true},
	date: { type: Date, default: Date.now },
	comment: [{body: "string", by: "string"}]
});

var User = mongoose.model("User", UserSchema);
var Post = mongoose.model("Post", PostSchema);
app.use(bodyParser.json());
app.use(cookieParser());
//Oauth info
app.use(passport.initialize());
app.use(passport.session());

//local login
passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({
      username: username
    }, function(err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false);
      }
      if (!user.verifyPassword(password)) {
        return done(null, false);
      }
      return done(null, user);
    });
  }
));

app.post('/login',
  passport.authenticate('local', {
    failureRedirect: '/login'
  }),
  function(req, res) {
    res.redirect('/');
  });

//github login
passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: "https://ancient-tundra-6889.herokuapp.com/"
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate({
      githubId: profile.id
    }, function(err, user) {
      return done(err, user);
    });
  }
));
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});

app.get('/auth/github',
  passport.authenticate('github', {
    scope: ['user:email']
  }));

app.get('/auth/github/callback',
  passport.authenticate('github', {
    failureRedirect: '/login'
  }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });


app.post('/comment', function(req, res) {
  Post.findOne({
    _id: req.body.postId
  }, function(err, post) {
    if (err) throw err;
    console.log(post);
    post.comment.unshift({
      body: req.body.comment,
      by: ""
    });
    post.save();
    console.log("comment saved");
    res.status(200).end();
  });
});


// middleware

app.post('/comments', function(req, res) {
  Post.findOne({
    _id: req.body.postId
  }, function(err, post) {
    if (err) throw err;
    res.send(post);
  });
});


app.post('/post', function (req, res) {
	console.log(req.body);
		var newpost = new Post({
				title: req.body.title,
				url: req.body.url,
				post: req.body.post
		});
		newpost.save(function(){
			res.status(200).end();
			console.log("saved a new post");
		});
});


app.get('/posts', function (req, res) {
  Post.find({}, function(err,posts){
  	if(err) throw err;
  	console.log(posts);
  	res.send(posts);
  }).sort({date: -1});
});

app.use(express.static('client'));
app.listen(process.env.PORT || 3000);
module.exports = app;
