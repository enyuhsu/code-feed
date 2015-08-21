var express = require('express');
var app = express();
var Sequelize = require('sequelize');
var pg = require('pg');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');

app.use(express.static('client'));
app.use(bodyParser.json());
app.use(cookieParser());


//var DATABASE_URL = 'postgres://ifxtabnfjinbbw:pGvSheCDwrimLtiqpbBm-YAekP@ec2-54-197-230-210.compute-1.amazonaws.com:5432/ddegi6ju8v9huu';
/**
pg.connect(process.env.DATABASE_URL, function(err, client) {
  if (err) throw err;
  console.log('Connected to postgres! Getting schemas...');

  client
    .query('SELECT table_schema,table_name FROM information_schema.tables;')
    .on('row', function(row) {
      console.log(JSON.stringify(row));
    });
});
*/


var sequelize = new Sequelize('postgres://ifxtabnfjinbbw:pGvSheCDwrimLtiqpbBm-YAekP@ec2-54-197-230-210.compute-1.amazonaws.com:5432/ddegi6ju8v9huu');

//Oauth info

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
    clientID: fe21f1ad7bc9146e6015,
    clientSecret: cab8552b2ca3cc736b7c0a0fe2b49a672a38400d,
    callbackURL: "http://127.0.0.1:3000/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate({ githubId: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
));
app.get('/auth/github',
  passport.authenticate('github', { scope: [ 'user:email' ] }));

app.get('/auth/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

var User = sequelize.define('users', {
	username: {
		type: Sequelize.STRING,
		field: 'username'
	},
	password: {
		type: Sequelize.STRING,
		field: 'password'
	},
	usertoken: {
		type: Sequelize.STRING,
		field: 'usertoken'
	},
	email: {
		type: Sequelize.STRING,
		field: 'email'
	}
	}, {
	freezeTableName: true

});

var Post =  sequelize.define('post',{
	title: {
		type: Sequelize.STRING,
		field: 'title'
	},
	url: {
		type: Sequelize.STRING,
		field: 'url'
	},
	posts: {
		type: Sequelize.STRING,
		field: 'posts'
	},
	username: {
		type : Sequelize.STRING,
		field: 'username'
	}
  },{

	freezeTableName: true
});

var Upvote =  sequelize.define('upvote',{
  title: {
    type: Sequelize.INTEGER,
    field: 'upvote'
  }
  }, {

  freezeTableName: true
});


var Comment = sequelize.define('comment', {
  comments:{
    type: Sequelize.STRING,
    field:'comments'
  }
    },{
   freezeTableName: true
});

User.sync();
Post.sync();
Comment.sync();
Upvote.sync();

User.hasMany(Post, {as: 'posts'});
User.hasMany(Comment,{as: 'comments'});
Post.hasMany(Comment, {as: 'comments'});
Post.belongsTo(User);
// Comments.belongsToMany()





app.post('/fb_login', function(req,res){
	User
	  .findOrCreate({
	  	where : {
	  		username : req.body.username
	  	},
	  	defaults:{
	  		usertoken : req.body.usertoken
	  	}
	  }).spread(function(user,created){
	  	user.updateAttributes({
      		usertoken : req.body.usertoken
      	});
	  });
});

app.get('/user/:id', function (req, res) {
  User
    .findById(id)
    .then(function (user) {
      res.send(user);
    })
    .catch(function (error) {
      if (error) {
        res.send(error);
      }
    });
});

app.post('/comment', function (req, res) {
  console.log(req.body);
  Comment
    .create(req.body)
    .then(function(comment){
      res.send(comment);
    })
    .catch(function (error) {
      if (error) {
        res.send(error);
      }
    });
});

// middleware

app.get('/com', function (req, res) {
  Comment
    .findAll()
    .then(function (comments) {
      res.send(comments);
    })
    .catch(function (error) {
      res.send(error);
    });
});

app.post('/post', function (req, res) {
	//query database where username = req.body.username and retrieve usertoken
	//if usertoken !== req.cookies.access_token
	console.log("Body: "+req.body);
	if(!req.cookies.username){
		console.log("Cookies don't exist: "+req.cookies.username);
		//res.send('Please log in before posting');
		res.error();
		res.end();
	} else {
		console.log("Cookies exist: "+req.cookies.username);
		User.find({username: req.cookies.username})
			.then(function(user){
				if(!user){
					res.send('Please log in before posting');
				}
				else if(req.cookies.access_token !== user.usertoken){
					console.log("Invalid token");
					res.error();
					res.end();
				}
				req.body.username = req.cookies.username;
				console.log(req.body);
				Post
				  .create(req.body)
				  .then(function(post){
				  	res.send(post);
				  	//res.send('post added');
				  })
				  .catch(function (error) {
				    if (error) {
				      res.send(error);
				    }
				  });
			});


  }
});


app.get('/posts', function (req, res) {
  Post
    .findAll()
    .then(function (posts) {
      res.send(posts);
    })
    .catch(function (error) {
      res.send(error);
    });
});

app.get('/fb_users', function (req, res) {
  User
    .findAll()
    .then(function (users) {
      res.send(users);
    })
    .catch(function (error) {
      res.send(error);
    });
});

app.post('/upvote', function (req, res) {
  console.log(req.body);
  Upvote
    .create(req.body)
    .then(function(upvote) {
      res.send(upvote);
    })
    .catch(function (error) {
      res.send(error);
    });
});


app.listen(process.env.PORT || 3000);
