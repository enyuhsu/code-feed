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
  bcrypt = require('bcrypt-nodejs'),
  hat = require('hat'),
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

/*app.all('/',function(req,res,next){
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});*/
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
  password: {
    type: String,
    required: true,
    index: {
      unique: true
    }
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
	// postedBy: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
	comment: [{body: "string", by: "string"}],
  likes: Number,
  dislikes: Number
});
// PostSchema.methods.upvote = function(cb){
//   this.upvotes += 1;
//   this.save(cb);
// }

// var CommentSchema = new Schema({
// 	comment: {type: String, required: true},
// 	date: {type: date, required: true},

// });

var User = mongoose.model("User", UserSchema);
var Post = mongoose.model("Post", PostSchema);
app.use(bodyParser.json());
app.use(cookieParser());
//Oauth info
app.use(passport.initialize());
app.use(passport.session());


/*//github login
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(obj, done) {
  done(null, obj);
});
passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    process.nextTick (function(){
      var user = new User(numGuess: re
      newUser.save(function (err, user){
        if(err){
          throw err;
      })
    });
    console.log(User);
  }
));

app.get('/auth/github',
  passport.authenticate('github', {
    scope: ['user:email']
  })
  //console.log('did get for auth/github');
  );

app.get('http://localhost:3000/auth/github/callback', passport.authenticate('github', {
  successRedirect: '/post',
  failureRedirect: '/'
  })
//console.log('/auth/github/callback');
);*/
//LOGINLOGINLOGINLOGIN
app.post('/signup', function(req, res, next){
  bcrypt.hash(req.body.password, null, null, function(err, hash){
    var user = new User({
      email: req.body.email,
      password:hash
    });
    user.save();
    res.status(200);
    res.send('/');
  })
});

app.post('/login', function(req, res){
  User.findOne({
    email: req.body.email
  }, function(err, data){
    if(err){
      return console.log(err);
    }
    bcrypt.compare(req.body.password, data.password, function(err, res2){
      if(res2){
        res.send(data.access_token);
      }
    });
    res.end();
  })
});

app.post('/comment', function(req, res) {
  console.log('server accessed');
  Post.findOne({
    _id: req.body.postId
  }, function(err, post) {
    if (err) throw err;
    post.comment.unshift({
      body: req.body.comment,
      by: "",
    });
    post.save();
    console.log("comment saved");
    res.status(200).end();
  });
});

app.put('/likes', function(req, res) {
  Post.findOne({
    _id: req.body.postId
  }, function(err, likes) {
    if (err) throw err;
    likes.likes = req.body.likes;
    likes.save(likes);
    res.send(likes);
    res.status(200).end();
  });
})

app.put('/dislikes', function(req, res) {
  Post.findOne({
    _id: req.body.postId
  }, function(err, dislikes) {
    if (err) throw err;
    dislikes.dislikes = req.body.dislikes;
    dislikes.save(dislikes);
    res.send(dislikes);
    res.status(200).end();
  });
})
// app.post('/post', function(req, res) {
//   console.log('server accessed');
//   Post.findOne({
//     _id: req.body.postId
//   }, function(err, post) {
//     if (err) throw err;
//     console.log(post + '= posts');
//     console.log(req.body.likes + '= req.body');
//     post.likes = req.body.likes;
//     post.save();
//     res.status(200).end();
//   });
// });
// app.put('/likes', function(req, res) {
//   console.log('server accessed');
//   Post.findOne({
//     _id: req.body.postId
//   }, function(err, post) {
//     if (err) throw err;
//     post.likes({
//       dislikes: req.body.likes
//     });
//     post.save();
//     res.status(200).end();
//   });
// });


// middleware

app.post('/comments', function(req, res) {
  Post.findOne({
    _id: req.body.postId
  }, function(err, post) {
    if (err) throw err;
    res.send(post);
    res.status(200).end();
  });
});


app.post('/post', function (req, res) {
	console.log(req.body);
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

});


app.get('/posts', function (req, res) {
  Post.find({}, function(err,posts){
  	if(err) throw err;
  	res.send(posts);
  }).sort({date: -1});
});



// app.post('/upvote', function (req, res) {

// });
app.use(express.static('client'));
app.listen(process.env.PORT || 3000);
module.exports = app;
